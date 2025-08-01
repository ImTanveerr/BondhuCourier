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
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized. Invalid token payload.",
        });
        return;
    }
    const parcelData = Object.assign(Object.assign({}, req.body), { senderId: verifiedToken.userId });
    const newParcel = yield sender_services_1.SenderServices.createParcel(parcelData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: newParcel,
    });
}));
// =============== Cancel Parcel ===============
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cancelledParcel = yield sender_services_1.SenderServices.cancelParcel(parcelId, verifiedToken.userId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Parcel cancelled successfully",
            data: cancelledParcel,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ success: false, message: error.message });
    }
}));
exports.SenderControllers = {
    createParcel,
    cancelParcel
};
