
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IParcel, Parcel, ParcelStatus } from "../parcel/parcel.model";

import { Types } from "mongoose";
import { parcelSearchableFields } from "./parcel.constant";
const jwt = require("jsonwebtoken");



const getMyParcels = async (filters: Record<string, any>) => {



  const builder = new QueryBuilder(Parcel.find({
    $or: [
      { senderId: filters.userId },
      { receiverId: filters.userId },
    ],
  }), filters);

  const resultQuery = builder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    resultQuery.build(),
    builder.getMeta(),
  ]);

  return { data, meta };
};



const getParcelById = async (parcelId: string, userId: string | Types.ObjectId) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    $or: [{ senderId: userId }, { receiverId: userId }],
  });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to access this parcel.");
  }

  return parcel;
};



export const ParcelServices = {
  getMyParcels,
  getParcelById
 
};