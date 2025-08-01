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
exports.ReceiverControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const receiver_service_1 = require("./receiver.service");
// ========== Get the incoming parcels=========
const IncomingParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        res.status(http_status_codes_1.default.FORBIDDEN).json({
            success: false,
            message: "Only receivers are allowed to view incoming parcels.",
        });
        return;
    }
    const parcels = yield receiver_service_1.ReceiverServices.IncomingParcels(verifiedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels fetched successfully",
        data: parcels,
    });
}));
// ============= Confirm the Delivery ============
const ReceiveParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const parcelId = req.params.id;
    try {
        const updatedParcel = yield receiver_service_1.ReceiverServices.ReceiveParcel(parcelId, verifiedToken.userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Delivery confirmed successfully",
            data: updatedParcel,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ success: false, message: error.message });
    }
}));
// ============= Confirm the Delivery ============
const ReturnParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const parcelId = req.params.id;
    try {
        const updatedParcel = yield receiver_service_1.ReceiverServices.ReturnParcel(parcelId, verifiedToken.userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Delivery confirmed successfully",
            data: updatedParcel,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ success: false, message: error.message });
    }
}));
// ========== Get the Delivered parcels=========
const DeliveredParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        res.status(http_status_codes_1.default.FORBIDDEN).json({
            success: false,
            message: "Only receivers are allowed to view delivered parcels.",
        });
        return;
    }
    const parcels = yield receiver_service_1.ReceiverServices.DeliveredParcels(verifiedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Delivered parcels fetched successfully",
        data: parcels,
    });
}));
exports.ReceiverControllers = {
    IncomingParcels,
    ReceiveParcel,
    DeliveredParcels,
    ReturnParcel
};
