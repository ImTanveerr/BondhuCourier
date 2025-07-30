import { Schema, model, Types } from 'mongoose';

export enum ParcelStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ParcelType {
  DOCUMENT = 'DOCUMENT',
  BOX = 'BOX',
  FRAGILE = 'FRAGILE',
  OTHER = 'OTHER',
}

export interface IParcel {
  _id?: Types.ObjectId;

  senderId:Types.ObjectId;
  receiverId: string;

  pickupAddress: string;
  deliveryAddress: string;
  contactNumber: string;

  weight: number;
  cost: number;
  parcelType: ParcelType;
  description?: string;

  status?: ParcelStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

const parcelSchema = new Schema<IParcel>(
  {
    senderId: {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
}
,
    receiverId: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    parcelType: {
      type: String,
      enum: Object.values(ParcelType),
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.PENDING,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Parcel = model<IParcel>('Parcel', parcelSchema);
