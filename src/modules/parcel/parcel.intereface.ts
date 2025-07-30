
import { Types } from "mongoose";

export interface IParcel {
  _id?: Types.ObjectId;
  senderId: Types.ObjectId | string;
  receiverId: string;

  pickupAddress: string;
  deliveryAddress: string;
  contactNumber: string;  // Contact number of receiver

  weight: number;
  cost: number;
  parcelType: "DOCUMENT" | "BOX" | "FRAGILE" | "OTHER";
  description?: string;

  status?: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

  createdAt?: Date;
  updatedAt?: Date;
}
