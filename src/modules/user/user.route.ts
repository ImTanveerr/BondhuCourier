import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router();

router.post("/register", UserControllers.createUser)
router.get("/track-parcel/:trackingId", UserControllers.TrackParcel); 



export const UserRoutes = router;
