"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const ReceiveParcel = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find parcel by ID and receiverId
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, receiverId });
    if (!parcel) {
        throw new Error("Parcel not found or you are not authorized to confirm this delivery.");
    }
    if (parcel.status === parcel_model_1.ParcelStatus.RECEIVED || parcel.status === parcel_model_1.ParcelStatus.CANCELLED) {
        throw new Error(`This parcel is already ${parcel.status}.`);
    }
    if (parcel.status !== parcel_model_1.ParcelStatus.DELIVERED) {
        throw new Error("This parcel is not DELIVERED yet");
    }
    parcel.status = parcel_model_1.ParcelStatus.RECEIVED;
    yield parcel.save();
    return parcel;
});
const ReturnParcel = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find parcel by ID and receiverId
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, receiverId });
    if (!parcel) {
        throw new Error("Parcel not found or you are not authorized to confirm this delivery.");
    }
    if (parcel.status === parcel_model_1.ParcelStatus.RETURNED || parcel.status === parcel_model_1.ParcelStatus.CANCELLED) {
        throw new Error(`This parcel is already ${parcel.status}.`);
    }
    if (parcel.status !== parcel_model_1.ParcelStatus.DELIVERED && parcel.status !== parcel_model_1.ParcelStatus.RECEIVED) {
        throw new Error(`parcel is not in a state to be returned. Current status: ${parcel.status}`);
    }
    parcel.status = parcel_model_1.ParcelStatus.RETURNED;
    yield parcel.save();
    return parcel;
});
const IncomingParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const excludedStatuses = [
        parcel_model_1.ParcelStatus.DELIVERED,
        parcel_model_1.ParcelStatus.CANCELLED,
        parcel_model_1.ParcelStatus.RECEIVED,
    ];
    const parcels = yield parcel_model_1.Parcel.find({
        receiverId,
        status: { $nin: excludedStatuses },
    }).sort({ createdAt: -1 });
    return parcels;
});
const DeliveredParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({
        receiverId,
        status: "DELIVERED",
    }).sort({ createdAt: -1 });
    return parcels;
});
exports.ReceiverServices = {
    ReceiveParcel,
    IncomingParcels,
    DeliveredParcels,
    ReturnParcel
};
