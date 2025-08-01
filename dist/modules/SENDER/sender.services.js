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
exports.SenderServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const createParcel = (parcelData) => __awaiter(void 0, void 0, void 0, function* () {
    const { weight, parcelType } = parcelData;
    let cost = 0;
    switch (parcelType) {
        case parcel_model_1.ParcelType.DOCUMENT:
            cost = 50 + weight * 5;
            break;
        case parcel_model_1.ParcelType.BOX:
            cost = 100 + weight * 10;
            break;
        case parcel_model_1.ParcelType.FRAGILE:
            cost = 150 + weight * 15;
            break;
        case parcel_model_1.ParcelType.OTHER:
        default:
            cost = 150 + weight * 20;
            break;
    }
    const newParcel = yield parcel_model_1.Parcel.create(Object.assign(Object.assign({}, parcelData), { cost }));
    return newParcel;
});
const cancelParcel = (parcelId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find parcel by id and senderId to ensure ownership
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, senderId: userId });
    if (!parcel) {
        throw new Error("Parcel not found or you are not authorized to cancel this parcel.");
    }
    // Check if the parcel is in a cancellable status
    if (parcel.status !== parcel_model_1.ParcelStatus.PENDING && parcel.status !== parcel_model_1.ParcelStatus.APPROVED) {
        throw new Error("Parcel can only be cancelled if it is in PENDING or APPROVED status.");
    }
    parcel.status = parcel_model_1.ParcelStatus.CANCELLED;
    yield parcel.save();
    return parcel;
});
exports.SenderServices = {
    createParcel,
    cancelParcel,
    //refundParcel
};
