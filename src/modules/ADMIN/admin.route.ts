import { Router } from "express";
import { UserControllers } from "../user/user.controller";
import { updateUserZodSchema  } from "../user/user.validation";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { AdminControllers } from "./admin.controllers";

const router = Router();


router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllUsers)
router.get("/all-parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllParcels)
router.patch("/user/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), AdminControllers.updateUser)
router.patch("/parcel/:id", AdminControllers.updateParcel)


export const AdminRoutes = router;
