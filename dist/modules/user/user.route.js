"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.UserControllers.createUser);
router.get("/track-parcel/:trackingId", user_controller_1.UserControllers.TrackParcel); // Example route for tracking parcels
exports.UserRoutes = router;
