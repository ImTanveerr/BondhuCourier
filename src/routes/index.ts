import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { SenderRoutes } from "../modules/SENDER/sender.routes";



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
    // {
    //     path: "/receiver",
    //     route: ReceiverRoutes
    // },
    // {
    //     path: "/admin",
    //     route: AdminRoutes
    // }

    
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

