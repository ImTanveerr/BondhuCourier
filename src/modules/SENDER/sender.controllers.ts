
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Parcel } from "../parcel/parcel.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import { SenderServices } from "./sender.services";
import { UserServices } from "../user/user.service";


// =============== Create Parcel ===============
const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Access token not found in cookies.",
    });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string; role: string };

  if (!verifiedToken?.userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Invalid token payload.",
    });
    return;
  }

  const parcelData = {
    ...req.body,
    senderId: verifiedToken.userId,
  };

  const newParcel = await SenderServices.createParcel(parcelData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    data: newParcel,
  });
});



// =============== Cancel Parcel ===============
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parcelId = req.params.id;

  try {
    const cancelledParcel = await SenderServices.cancelParcel(parcelId, verifiedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel cancelled successfully",
      data: cancelledParcel,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ success: false, message: error.message });
  }
});
// =============== Get Parcel by ID ===============

const getParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parcelId = req.params.id;

  try {
    const parcel = await SenderServices.getParcelById(parcelId, verifiedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel fetched successfully",
      data: parcel,
    });
  } catch (error: any) {
    res.status(httpStatus.NOT_FOUND).json({ success: false, message: error.message });
  }
});
    
// =============== Get All Parcels for Sender ===============
const getMyParcels = catchAsync(async (req, res) => {
  const token = req.cookies?.accessToken;
  const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as { userId: string };

  if (!verifiedToken?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parcels = await SenderServices.getMyParcels(verifiedToken.userId);

   sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Fetched parcels successfully",
    data: parcels,
  });
});


export const SenderControllers = {
    createParcel,
    cancelParcel,
    getMyParcels,
    getParcelById
}

