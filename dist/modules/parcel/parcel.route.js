"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const parcel_controllers_1 = require("./parcel.controllers");
const router = (0, express_1.Router)();
router.get("/get-parcel/:id", parcel_controllers_1.ParcelControllers.getParcelById);
router.get("/get-parcels", parcel_controllers_1.ParcelControllers.getMyParcels);
exports.ParcelRoutes = router;
