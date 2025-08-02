"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderRoutes = void 0;
const express_1 = require("express");
const sender_controllers_1 = require("./sender.controllers");
const router = (0, express_1.Router)();
router.post("/create-parcel", sender_controllers_1.SenderControllers.createParcel);
router.post("/Cancel-parcel/:id", sender_controllers_1.SenderControllers.CancelParcel);
exports.SenderRoutes = router;
