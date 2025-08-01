import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { User ,UserStatus} from "../modules/user/user.model";
import httpStatus from "http-status-codes";


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }
        
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)  as JwtPayload

        
    const isUserExist = await User.findOne({ email:verifiedToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    if (isUserExist.Status===UserStatus.BLOCKED|| isUserExist.Status===UserStatus.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked or inactive")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }
}