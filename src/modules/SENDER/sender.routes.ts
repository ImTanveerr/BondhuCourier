import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../../middlewares/ValidateRequest";

import { checkAuth } from "../../middlewares/checkAuth";
import { SenderControllers } from "./sender.controllers";
import { object } from "zod";
import { Role } from "../user/user.interface";
import { updateUserZodSchema } from "../user/user.validation";

const router = Router();

router.post("/create-parcel", checkAuth(Role.ADMIN, Role.SUPER_ADMIN,Role.SENDER), SenderControllers.createParcel);
router.post("/Cancel-parcel/:id", SenderControllers.cancelParcel);
router.get("/get-parcel/:id", SenderControllers.getParcelById);
router.get("/get-parcels", SenderControllers.getMyParcels);


export const SenderRoutes = router;