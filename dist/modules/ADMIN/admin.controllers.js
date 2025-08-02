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
exports.AdminControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
// Update user function
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const user = yield admin_service_1.AdminServices.updateUser(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
}));
// Block user function
const BlockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield admin_service_1.AdminServices.BlockUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User blocked successfully.",
        data: user,
    });
}));
// UnBlock user function
const UnBlockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield admin_service_1.AdminServices.UnBlockUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User is active again.",
        data: user,
    });
}));
// Get all users function
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
}));
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllParcels(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const token = req.headers.authorization;
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    const payload = req.body;
    const parcel = yield admin_service_1.AdminServices.updateParcel(parcelId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel updated successfully",
        data: parcel,
    });
}));
const ApproveParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield admin_service_1.AdminServices.ApproveParcel(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel approved successfully",
        data: parcel,
    });
}));
const CancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield admin_service_1.AdminServices.CancelParcel(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel cancelled successfully",
        data: parcel,
    });
}));
const DeleteParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    yield admin_service_1.AdminServices.DeleteParcel(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel deleted successfully",
        data: null,
    });
}));
const DeleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    yield admin_service_1.AdminServices.DeleteUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User deleted successfully",
        data: null
    });
}));
exports.AdminControllers = {
    getAllParcels,
    updateParcel,
    getAllUsers,
    updateUser,
    BlockUser,
    UnBlockUser,
    ApproveParcel,
    CancelParcel,
    DeleteParcel,
    DeleteUser
};
