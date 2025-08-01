import { Router } from "express";
import { updateUserZodSchema  } from "../user/user.validation";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { Role } from "../user/user.model";
import { checkAuth } from "../../middlewares/checkAuth";
import { AdminControllers } from "./admin.controllers";

const router = Router();


router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllUsers)
router.get("/all-parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllParcels)
router.patch("/update-user/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), AdminControllers.updateUser)
router.patch("/parcel/:id", AdminControllers.updateParcel)


router.post("/approve-parcel/:id", AdminControllers.ApproveParcel)
router.post("/cancel-parcel/:id", AdminControllers.CancelParcel)


router.post("/block-user/:id", AdminControllers.BlockUser)
router.post("/unblock-user/:id", AdminControllers.UnBlockUser)


export const AdminRoutes = router;
