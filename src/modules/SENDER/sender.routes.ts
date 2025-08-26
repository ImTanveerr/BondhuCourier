import { Router } from "express";
import { SenderControllers } from "./sender.controllers";

const router = Router();

router.post("/create-parcel",  SenderControllers.createParcel);
router.post("/Cancel-parcel/:id", SenderControllers.CancelParcel);


export const SenderRoutes = router;