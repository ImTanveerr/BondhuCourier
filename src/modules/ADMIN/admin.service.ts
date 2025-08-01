import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, Parcel, ParcelStatus } from "../parcel/parcel.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { parcelSearchableFields } from "../parcel/parcel.constant";



const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }


    if (payload.role) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};




const getAllParcels = async (filters: Record<string, any>) => {



  const builder = new QueryBuilder(Parcel.find(), filters);

  const resultQuery = builder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    resultQuery.build(),
    builder.getMeta(),
  ]);

  return { data, meta };
};


function generateTrackingId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit
    return `TRK-${datePart}-${randomPart}`;
}

const updateParcel = async (
    parcelId: string,
    payload: Partial<{ status: ParcelStatus; note?: string; location?: string }>,
    decodedToken: JwtPayload
) => {
    if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can update parcels");
    }

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    const updateFields: any = { ...payload };

    // ✅ Assign tracking ID and first tracking event if status is APPROVED and no tracking ID yet
    if (payload.status === ParcelStatus.APPROVED && !parcel.trackingId) {
        updateFields.trackingId = generateTrackingId();
        updateFields.trackingEvents = [
            ...(parcel.trackingEvents || []),
            {
                location: payload.location || parcel.pickupAddress,
                status: ParcelStatus.APPROVED,
                timestamp: new Date(),
                note: payload.note || "Parcel approved",
            },
        ];
    }

    // ✅ Add tracking log for any other status update (if tracking already exists)
    if (payload.status && parcel.trackingId) {
        await Parcel.findByIdAndUpdate(parcelId, {
            $push: {
                trackingEvents: {
                    location: payload.location || "Unknown",
                    status: payload.status,
                    timestamp: new Date(),
                    note: payload.note || "",
                },
            },
        });
    }

    // ✅ Update main parcel fields
    const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, updateFields, {
        new: true,
        runValidators: true,
    });

    return updatedParcel;
};



export const AdminServices = {
    getAllUsers,
    updateUser,
    getAllParcels,
    updateParcel
}
