"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = exports.ParcelType = exports.ParcelStatus = void 0;
const mongoose_1 = require("mongoose");
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["PENDING"] = "PENDING";
    ParcelStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ParcelStatus["DELIVERED"] = "DELIVERED";
    ParcelStatus["CANCELLED"] = "CANCELLED";
    ParcelStatus["RECEIVED"] = "RECEIVED";
    ParcelStatus["RETURNED"] = "RETURNED";
    ParcelStatus["APPROVED"] = "APPROVED";
    ParcelStatus["DISPATCHED"] = "DISPATCHED";
    ParcelStatus["REFUNDED"] = "REFUNDED";
    ParcelStatus["RESCHEDULED"] = "RESCHEDULED";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
var ParcelType;
(function (ParcelType) {
    ParcelType["DOCUMENT"] = "DOCUMENT";
    ParcelType["BOX"] = "BOX";
    ParcelType["FRAGILE"] = "FRAGILE";
    ParcelType["OTHER"] = "OTHER";
})(ParcelType || (exports.ParcelType = ParcelType = {}));
const trackingEventSchema = new mongoose_1.Schema({
    location: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
}, { _id: false } // avoid creating _id for subdocuments
);
const parcelSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
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
    trackingId: {
        type: String,
        unique: true,
        sparse: true, // allows null/undefined values to not violate uniqueness
    },
    trackingEvents: {
        type: [trackingEventSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.Parcel = (0, mongoose_1.model)('Parcel', parcelSchema);
