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
exports.SenderControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const sender_services_1 = require("./sender.services");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
/* eslint-disable @typescript-eslint/no-explicit-any */
// =============== Create Parcel ===============
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized. Access token not found in cookies.",
        });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId) || !(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.role)) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized. Invalid token payload.",
        });
        return;
    }
    const user = yield user_model_1.User.findById(verifiedToken.userId);
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized. User not found.",
        });
        return;
    }
    if (user.Status === user_model_1.UserStatus.BANNED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Your account has been banned. Please contact support.");
    }
    // Ensure only senders can create parcels
    if (verifiedToken.role !== user_model_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only senders can create parcels.");
    }
    const parcelData = Object.assign(Object.assign({}, req.body), { senderId: verifiedToken.userId });
    const newParcel = yield sender_services_1.SenderServices.createParcel(parcelData, verifiedToken.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: newParcel,
    });
}));
// =============== Cancel Parcel ===============
const CancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId) || !(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.role)) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const parcelId = req.params.id;
    try {
        const updatedParcel = yield sender_services_1.SenderServices.cancelParcel(parcelId, verifiedToken.userId, verifiedToken.role);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Parcel cancelled successfully",
            data: updatedParcel,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ success: false, message: error.message });
    }
}));
exports.SenderControllers = {
    createParcel,
    CancelParcel
};
