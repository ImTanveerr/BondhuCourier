"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleCastError = () => {
    return {
        statusCode: 404,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    };
};
exports.handleCastError = handleCastError;
