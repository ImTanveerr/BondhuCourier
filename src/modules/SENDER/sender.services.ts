
import { IParcel, Parcel, ParcelStatus, ParcelType } from "../parcel/parcel.model";


import { Types } from "mongoose";



const createParcel = async (parcelData: Omit<IParcel, "cost">) => {
  const { weight, parcelType } = parcelData;

  let cost = 0;

 
  switch (parcelType) {
    case ParcelType.DOCUMENT:
      cost = 50 + weight * 5;
      break;
    case ParcelType.BOX:
      cost = 100 + weight * 10;
      break;
    case ParcelType.FRAGILE:
      cost = 150 + weight * 15;
      break;
    case ParcelType.OTHER:
    default:
      cost = 150 + weight * 20;
      break;
  }

  
  const newParcel = await Parcel.create({
    ...parcelData,
    cost,
  });

  return newParcel;
};




const cancelParcel = async (parcelId: string, userId: string | Types.ObjectId) => {
  // Find parcel by id and senderId to ensure ownership
  const parcel = await Parcel.findOne({ _id: parcelId, senderId: userId });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to cancel this parcel.");
  }

  // Check if the parcel is in a cancellable status
  if (parcel.status !== ParcelStatus.PENDING && parcel.status !== ParcelStatus.APPROVED) {
    throw new Error("Parcel can only be cancelled if it is in PENDING or APPROVED status.");
  }

  parcel.status = ParcelStatus.CANCELLED;
  await parcel.save();

  return parcel;
};

export const SenderServices = {
  createParcel,
  cancelParcel,
  //refundParcel
};