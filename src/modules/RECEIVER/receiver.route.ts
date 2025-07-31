import { Router } from "express";
import { ReceiverControllers } from "./receiver.controllers";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/incoming-parcel", ReceiverControllers.IncomingParcels);  // receiver get the pending parcel
router.get("/delivered-parcel", ReceiverControllers.DeliveredParcels);  // receiver get the pending parcel
router.post("/accept-parcel/:id",ReceiverControllers.confirmDelivery);  // receiver accept the parcel
//router.post("/accept-parcel/:id", checkAuth(Role.RECEIVER),ReceiverControllers.confirmDelivery);  // receiver accept the parcel



export const ReceiverRoutes = router;