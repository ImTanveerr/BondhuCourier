import { Router } from "express";
import { SenderControllers } from "./sender.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.model";

const router = Router();

router.post("/create-parcel",  SenderControllers.createParcel);
router.post("/Cancel/:id", SenderControllers.CancelParcel)


export const SenderRoutes = router;