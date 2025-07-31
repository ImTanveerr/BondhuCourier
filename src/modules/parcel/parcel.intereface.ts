
// import { Types } from "mongoose";

// export interface IParcel {
//   _id?: Types.ObjectId;
//   senderId: Types.ObjectId | string;
//   receiverId: string;

//   pickupAddress: string;
//   deliveryAddress: string;
//   contactNumber: string;  // Contact number of receiver

//   weight: number;
//   cost: number;
//   parcelType: "DOCUMENT" | "BOX" | "FRAGILE" | "OTHER";
//   description?: string;


//   //cancel is only for admin and sender
//   //after dispatch, sender cannot cancel
//   //after delivery, user can receive or return
//   //can't be deleted  
//   status?: "PENDING" |"APPROVED"| "CANCELLED"|"DISPATCHED"|"IN_TRANSIT" | "DELIVERED" |"REFUNDED"|"RETURNED"|"RECEIVED"| "RESCHEDULED";


  
//   createdAt?: Date;
//   updatedAt?: Date;
// }
