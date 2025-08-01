import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.model";
import { User } from "./user.model";
import { Parcel } from "../parcel/parcel.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password,role,...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    if(role== "ADMIN"|| role == "SUPER_ADMIN") {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot create an admin user from here")
    } 

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        role : role || "SENDER", 
        ...rest
    })

    return user

}


const TrackParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId }).select("trackingEvents");

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel with this tracking ID was not found");
  }

  return parcel.trackingEvents; 
};


export const UserServices = {
    createUser,
    TrackParcel
}
