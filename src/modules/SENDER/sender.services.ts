import bcryptjs from "bcryptjs";

import { IAuthProvider, IUser, Role } from "../user/user.interface";
import { User } from "../user//user.model";
import { IParcel, Parcel, ParcelStatus } from "../parcel/parcel.model";

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Types } from "mongoose";
const jwt = require("jsonwebtoken");


const createParcel = async (parcelData: IParcel) => {
  const newParcel = await Parcel.create(parcelData);
  return newParcel;
};




const cancelParcel = async (parcelId: string, userId: string | Types.ObjectId) => {
  // Find parcel by id and senderId to ensure ownership
  const parcel = await Parcel.findOne({ _id: parcelId, senderId: userId });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to cancel this parcel.");
  }

  if (parcel.status === "CANCELLED" || parcel.status === "DELIVERED") {
    throw new Error("Parcel is already cancelled.");
  }

  parcel.status = ParcelStatus.CANCELLED;
  await parcel.save();

  return parcel;
};

export const SenderServices = {
  createParcel,
  cancelParcel
};