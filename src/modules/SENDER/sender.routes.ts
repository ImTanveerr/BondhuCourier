import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { SenderControllers } from "./sender.controllers";
import { Role } from "../user/user.model";

const router = Router();

router.post("/create-parcel",  SenderControllers.createParcel);
router.post("/Cancel-parcel/:id", SenderControllers.CancelParcel);


export const SenderRoutes = router;