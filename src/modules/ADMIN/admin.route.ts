import { Router } from "express";
import { updateUserZodSchema  } from "../user/user.validation";

import { Role } from "../user/user.model";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { AdminControllers } from "../../app/modules/ADMIN/admin.controllers";


const router = Router();


router.get("/users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllUsers)
router.get("/parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.getAllParcels)
router.patch("/update-user/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.updateUser)
router.patch("/parcel/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.updateParcel)

router.delete("/delete-parcel/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.DeleteParcel)
router.delete("/delete-user/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.DeleteUser)


router.post("/approve-parcel/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.ApproveParcel)
router.post("/cancel-parcel/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.CancelParcel)
router.post("/Deliver-parcel/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.DeliverParcel)

router.post("/block-user/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),AdminControllers.BlockUser)
router.post("/unblock-user/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminControllers.UnBlockUser)


export const AdminRoutes = router;
