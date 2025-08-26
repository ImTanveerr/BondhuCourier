import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { SenderRoutes } from "../modules/SENDER/sender.routes";
import { ReceiverRoutes } from "../modules/RECEIVER/receiver.route";
import { AdminRoutes } from "../modules/ADMIN/admin.route";



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
        path: "/receiver",
        route: ReceiverRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    }

    
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

