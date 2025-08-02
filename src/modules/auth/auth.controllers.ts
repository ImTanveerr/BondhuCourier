import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userToken";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { UserStatus } from "../user/user.model";
//import {  IsActive } from "../user/user.interface";

/* eslint-disable @typescript-eslint/no-explicit-any */
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    //const loginInfo = await AuthServices.credentialsLogin(req.body);

    passport.authenticate("local", async (error: any, user: any, info: any) => {

        if (error) {
            return next(error)
        }
        if (!user) {
            return next(new AppError(401, info.message))
        }

        if (user.Status === UserStatus.BLOCKED) {

            return next(new AppError(403, "Your account has been blocked. Please contact support."));
        }

        const userTokens = await createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()



        setAuthCookie(res, userTokens)


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            },
        })
    })(req, res, next)

})




const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New access token retrived successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response) => {


    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const googleCallBackController = catchAsync(async (req: Request, res: Response) => {

    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    const tokenInfo = createUserTokens(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})
const resetPassword = catchAsync(async (req: Request, res: Response) => {


    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)



    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})



export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallBackController
}