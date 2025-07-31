
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { Parcel } from "../parcel/parcel.model";
import AppError from "../../errorHelpers/AppError";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
});


const TrackParcel = catchAsync(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;

  const result = await UserServices.TrackParcel(trackingId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tracking information retrieved successfully",
    data: result,
  });
});


export const UserControllers = {
    createUser,
    TrackParcel    
}

