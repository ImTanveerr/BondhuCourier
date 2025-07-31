import { Parcel, ParcelStatus } from "../parcel/parcel.model";
import { Types } from "mongoose";


const confirmDelivery = async (parcelId: string, receiverId: string | Types.ObjectId) => {
  // Find parcel by ID and receiverId
  const parcel = await Parcel.findOne({ _id: parcelId, receiverId });

  if (!parcel) {
    throw new Error("Parcel not found or you are not authorized to confirm this delivery.");
  }

  if (parcel.status === "RECEIVED") {
    throw new Error("This parcel is already marked as RECEIVED.");
  }

  if (parcel.status === "CANCELLED" ) {
    throw new Error("This parcel is already marked as CANCELLED.");
  }

  parcel.status =  ParcelStatus.RECEIVED;
  await parcel.save();

  return parcel;
};



const IncomingParcels = async (receiverId: string | Types.ObjectId) => {
  const parcels = await Parcel.find({ 
    receiverId, 
    status: "PENDING" 
  }).sort({ createdAt: -1 });

  return parcels;
};


const DeliveredParcels = async (receiverId: string | Types.ObjectId) => {
  const parcels = await Parcel.find({
    receiverId,
    status: "DELIVERED",
  }).sort({ createdAt: -1 });

  return parcels;
};
export const ReceiverServices = {
  confirmDelivery,IncomingParcels,DeliveredParcels
};