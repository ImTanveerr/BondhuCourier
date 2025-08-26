import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { SenderRoutes } from "../modules/SENDER/sender.routes";
import { AdminRoutes } from "../modules/ADMIN/admin.route";
import { ReceiverRoutes } from "../modules/RECEIVER/receiver.route";




export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/sender",
        route: SenderRoutes
    },
    {
        path: "/parcel",
        route: ParcelRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/receiver",
        route: ReceiverRoutes
    }
   
    

    
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

