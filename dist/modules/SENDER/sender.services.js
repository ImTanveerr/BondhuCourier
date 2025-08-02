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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderServices = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createParcel = (parcelData, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Only Sender can access this
    if (userRole !== user_model_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized. Only senders can create parcels.");
    }
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
const cancelParcel = (parcelId, senderId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    // Only sender can access this
    if (userRole !== user_model_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized. Only sender can cancel this parcel.");
    }
    // Find parcel by ID and senderId (not receiverId!)
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, senderId });
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found or you are not authorized to cancel this parcel.");
    }
    if (parcel.status === parcel_model_1.ParcelStatus.RECEIVED || parcel.status === parcel_model_1.ParcelStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `This parcel is already ${parcel.status}.`);
    }
    parcel.status = parcel_model_1.ParcelStatus.CANCELLED;
    yield parcel.save();
    return parcel;
});
exports.SenderServices = {
    createParcel,
    cancelParcel
};
