"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const sender_routes_1 = require("../modules/SENDER/sender.routes");
const receiver_route_1 = require("../modules/RECEIVER/receiver.route");
const admin_route_1 = require("../modules/ADMIN/admin.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/sender",
        route: sender_routes_1.SenderRoutes
    },
    {
        path: "/parcel",
        route: parcel_route_1.ParcelRoutes
    },
    {
        path: "/receiver",
        route: receiver_route_1.ReceiverRoutes
    },
    {
        path: "/admin",
        route: admin_route_1.AdminRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
