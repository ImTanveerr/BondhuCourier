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
exports.AdminServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const user_model_2 = require("../user/user.model");
const parcel_model_1 = require("../parcel/parcel.model");
/* eslint-disable @typescript-eslint/no-explicit-any */
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_2.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role) {
        if (decodedToken.role === user_model_1.Role.SENDER || decodedToken.role === user_model_1.Role.RECEIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (payload.role === user_model_1.Role.SUPER_ADMIN && decodedToken.role === user_model_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.Status || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_model_1.Role.SENDER || decodedToken.role === user_model_1.Role.RECEIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_2.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
});
const BlockUser = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_2.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status === user_model_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already blocked.");
    }
    if (decodedToken.role === user_model_1.Role.SENDER || decodedToken.role === user_model_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    user.Status = user_model_1.UserStatus.BLOCKED;
    const updatedUser = yield user.save();
    return updatedUser;
});
//unblock user function- unblock mean he is active again
const UnBlockUser = (userId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_2.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    console.log("USER status", user.Status);
    if (user.Status !== user_model_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not blocked.");
    }
    if (decodedToken.role === user_model_1.Role.SENDER || decodedToken.role === user_model_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    user.Status = user_model_1.UserStatus.ACTIVE;
    const updatedUser = yield user.save();
    return updatedUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_2.User.find({});
    const totalUsers = yield user_model_2.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find().populate("senderId receiverId");
    const total = yield parcel_model_1.Parcel.countDocuments();
    return {
        data: parcels,
        meta: {
            total,
        },
    };
});
function generateTrackingId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;
    const randomPart = Math.floor(100000 + Math.random() * 900000); // 6-digit
    return `TRK-${datePart}-${randomPart}`;
}
const updateParcel = (parcelId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_model_1.Role.ADMIN && decodedToken.role !== user_model_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can update parcels");
    }
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    const updateFields = Object.assign({}, payload);
    // ✅ Assign tracking ID and first tracking event if status is APPROVED and no tracking ID yet
    if (payload.status === parcel_model_1.ParcelStatus.APPROVED && !parcel.trackingId) {
        updateFields.trackingId = generateTrackingId();
        updateFields.trackingEvents = [
            ...(parcel.trackingEvents || []),
            {
                location: payload.location || parcel.pickupAddress,
                status: parcel_model_1.ParcelStatus.APPROVED,
                timestamp: new Date(),
                note: payload.note || "Parcel approved",
            },
        ];
    }
    // ✅ Add tracking log for any other status update (if tracking already exists)
    if (payload.status && parcel.trackingId) {
        yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, {
            $push: {
                trackingEvents: {
                    location: payload.location || "Unknown",
                    status: payload.status,
                    timestamp: new Date(),
                    note: payload.note || "",
                },
            },
        });
    }
    // ✅ Update main parcel fields
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, updateFields, {
        new: true,
        runValidators: true,
    });
    return updatedParcel;
});
const ApproveParcel = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    //  Ensure only admins can approve
    if (decodedToken.role !== user_model_1.Role.ADMIN && decodedToken.role !== user_model_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can approve parcels");
    }
    //  Find parcel
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    //  Don't approve if already approved or beyond
    if (parcel.status === parcel_model_1.ParcelStatus.APPROVED ||
        parcel.status === parcel_model_1.ParcelStatus.IN_TRANSIT ||
        parcel.status === parcel_model_1.ParcelStatus.DELIVERED ||
        parcel.status === parcel_model_1.ParcelStatus.RECEIVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel is already ${parcel.status}`);
    }
    // Set trackingId and push first tracking event
    const trackingId = parcel.trackingId || generateTrackingId();
    const trackingEvent = {
        location: parcel.pickupAddress || "Unknown",
        status: parcel_model_1.ParcelStatus.APPROVED,
        timestamp: new Date(),
        note: "Parcel approved by admin",
    };
    // Update parcel with status, tracking ID, and first tracking event
    parcel.status = parcel_model_1.ParcelStatus.APPROVED;
    parcel.trackingId = trackingId;
    parcel.trackingEvents = [...(parcel.trackingEvents || []), trackingEvent];
    const updatedParcel = yield parcel.save();
    return updatedParcel;
});
const CancelParcel = (parcelId, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_model_1.Role.ADMIN &&
        decodedToken.role !== user_model_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only admins can cancel parcels");
    }
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.status === parcel_model_1.ParcelStatus.CANCELLED ||
        parcel.status === parcel_model_1.ParcelStatus.DELIVERED ||
        parcel.status === parcel_model_1.ParcelStatus.RECEIVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel is already ${parcel.status} and cannot be cancelled`);
    }
    // Optional: add a cancellation tracking event
    //   parcel.trackingEvents = [
    //     ...(parcel.trackingEvents || []),
    //     {
    //       location: "N/A",
    //       status: ParcelStatus.CANCELLED,
    //       timestamp: new Date(),
    //       note: "Parcel cancelled by admin",
    //     },
    //   ];
    //   parcel.status = ParcelStatus.CANCELLED;
    const updatedParcel = yield parcel.save();
    return updatedParcel;
});
exports.AdminServices = {
    getAllUsers,
    updateUser,
    getAllParcels,
    updateParcel,
    BlockUser,
    UnBlockUser,
    ApproveParcel,
    CancelParcel
};
