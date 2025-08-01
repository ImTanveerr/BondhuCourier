import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role, UserStatus } from "../user/user.model";
import { User } from "../user/user.model";
import { Parcel, ParcelStatus } from "../parcel/parcel.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

    if (payload.Status || payload.isDeleted || payload.isVerified) {
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

const BlockUser = async (userId: string, decodedToken: JwtPayload) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked.");
    }

    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }


    user.Status = UserStatus.BLOCKED;
    const updatedUser = await user.save();
    return updatedUser;
};

//unblock user function- unblock mean he is active again
const UnBlockUser = async (userId: string, decodedToken: JwtPayload) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status !== UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not blocked.");
    }

    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }


    user.Status = UserStatus.ACTIVE;
    const updatedUser = await user.save();
    return updatedUser;
};


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



const getAllParcels = async () => {
    const parcels = await Parcel.find().populate("senderId receiverId");
    const total = await Parcel.countDocuments();

    return {
        data: parcels,
        meta: {
            total,
        },
    };
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


const ApproveParcel = async (parcelId: string, decodedToken: JwtPayload) => {
    //  Ensure only admins can approve
    if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Only admins can approve parcels");
    }

    //  Find parcel
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    //  Don't approve if already approved or beyond
    if (
        parcel.status === ParcelStatus.APPROVED ||
        parcel.status === ParcelStatus.IN_TRANSIT ||
        parcel.status === ParcelStatus.DELIVERED ||
        parcel.status === ParcelStatus.RECEIVED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Parcel is already ${parcel.status}`
        );
    }

    // Set trackingId and push first tracking event
    const trackingId = parcel.trackingId || generateTrackingId();

    const trackingEvent = {
        location: parcel.pickupAddress || "Unknown",
        status: ParcelStatus.APPROVED,
        timestamp: new Date(),
        note: "Parcel approved by admin",
    };

    // Update parcel with status, tracking ID, and first tracking event
    parcel.status = ParcelStatus.APPROVED;
    parcel.trackingId = trackingId;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];

    const updatedParcel = await parcel.save();
    return updatedParcel;
};


const CancelParcel = async (parcelId: string, decodedToken: JwtPayload) => {
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Only admins can cancel parcels");
  }

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (
    parcel.status === ParcelStatus.CANCELLED ||
    parcel.status === ParcelStatus.DELIVERED ||
    parcel.status === ParcelStatus.RECEIVED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Parcel is already ${parcel.status} and cannot be cancelled`
    );
  }

  
  parcel.status = ParcelStatus.CANCELLED;


  const updatedParcel = await parcel.save();
  return updatedParcel;
};

export const AdminServices = {
    getAllUsers,
    updateUser,
    getAllParcels,
    updateParcel,
    BlockUser,
    UnBlockUser,
    ApproveParcel,
    CancelParcel
}
