import {  Router } from "express";
import { AuthControllers } from "./auth.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.model";
import { Request, Response } from "express";
import passport from "passport";

const router=Router();
router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post("/reset-password",checkAuth( ...Object.values(Role)),AuthControllers.resetPassword)
router.get("/google",async(req: Request,res: Response)=>{
    const redirect=req.query.redirect ||"/" ;
    passport.authenticate("google",{scope:["profile","email"],state:redirect as string})(req,res)
})

router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),AuthControllers.googleCallBackController)

export const AuthRoutes = router;