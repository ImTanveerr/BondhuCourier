import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { SenderControllers } from "./sender.controllers";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/create-parcel", checkAuth(Role.ADMIN, Role.SUPER_ADMIN,Role.SENDER), SenderControllers.createParcel);
router.post("/Cancel-parcel/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN,Role.SENDER),SenderControllers.cancelParcel);
// router.get("/get-parcel/:id", SenderControllers.getParcelById);
// router.get("/get-parcels", SenderControllers.getMyParcels);


export const SenderRoutes = router;