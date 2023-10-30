import {Router} from "express";
 
import * as commonController from "../controllers/commonController.js"

const router = Router();

// Post Requests    

router.route("/send-otp").post(commonController.sendOtp)

router.route("/forgot-psswd/:user").post(commonController.forgotPsswd)

router.route("/reset-psswd/:id/:tk/:user").post(commonController.resetPsswd)

router.route("/verify-otp").post(commonController.verifyOtp)

router.route("/view-spec-blog").get(commonController.viewSpecBlog)



// Get Requests 

router.route("/reset-session").get(commonController.reset)

 
export default router 