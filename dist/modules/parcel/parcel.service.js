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
exports.ParcelServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const getMyParcels = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });
    return parcels;
});
const getParcelById = (parcelId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({
        _id: parcelId,
        $or: [{ senderId: userId }, { receiverId: userId }],
    });
    if (!parcel) {
        throw new Error("Parcel not found or you are not authorized to access this parcel.");
    }
    return parcel;
});
exports.ParcelServices = {
    getMyParcels,
    getParcelById
};
