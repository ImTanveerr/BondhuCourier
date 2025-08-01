import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { UserStatus, IUser } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";

import httpStatus from "http-status-codes";


export const createUserTokens= (user: Partial<IUser>)=>{
        const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)

    return{
        accessToken, refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken=async (refreshToken: string)=>{
     const verifiedRefreshToken=verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
    

    const isUserExist = await User.findOne({ email:verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    if (isUserExist.Status===UserStatus.BLOCKED|| isUserExist.Status===UserStatus.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked or inactive")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }
     
    const jwtPayload={
        userID :isUserExist._id,
        email : isUserExist.email,
        role: isUserExist.role
    }
    const accessToken=generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)

    return accessToken;
}