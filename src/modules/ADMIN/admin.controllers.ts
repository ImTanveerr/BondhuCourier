
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { AdminServices } from "./admin.service";
import { Role } from "../user/user.interface";


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as unknown as JwtPayload
    const payload = req.body;
    const user = await AdminServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminServices.getAllUsers();


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})




const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  const result = await AdminServices.getAllParcels();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updateParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parcelId = req.params.id;
  
   const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as unknown as JwtPayload
    const payload = req.body;

  const parcel = await AdminServices.updateParcel(parcelId, payload, verifiedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel updated successfully",
    data: parcel,
  });
});



export const AdminControllers = {
    getAllParcels,
    updateParcel,
    getAllUsers,
    updateUser
}

