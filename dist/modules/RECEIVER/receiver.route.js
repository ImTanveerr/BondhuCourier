"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiverRoutes = void 0;
const express_1 = require("express");
const receiver_controllers_1 = require("./receiver.controllers");
const router = (0, express_1.Router)();
router.get("/incoming-parcel", receiver_controllers_1.ReceiverControllers.IncomingParcels); // receiver get the pending parcel
router.get("/delivered-parcel", receiver_controllers_1.ReceiverControllers.DeliveredParcels); // receiver get the Delivered parcel
router.post("/return-parcel/:id", receiver_controllers_1.ReceiverControllers.ReturnParcel); // receiver return the parcel
router.post("/accept-parcel/:id", receiver_controllers_1.ReceiverControllers.ReceiveParcel); // receiver accept the parcel
//router.post("/accept-parcel/:id", checkAuth(Role.RECEIVER),ReceiverControllers.ReceiveParcel);  // receiver accept the parcel
exports.ReceiverRoutes = router;
