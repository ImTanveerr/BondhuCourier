import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IParcel, Parcel } from "../parcel/parcel.model";



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



const updateParcel = async (
  parcelId: string,
  payload: Partial<IParcel>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== Role.ADMIN && decodedToken.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Only admins can update parcels");
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedParcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  return updatedParcel;
};






export const AdminServices = {
    getAllUsers,
    updateUser,
    getAllParcels,
    updateParcel
}
