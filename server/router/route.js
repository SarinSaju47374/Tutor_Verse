import {Router} from "express";
 
import * as controller from "../controllers/controllers.js"
const router = Router();

// Post Requests    
router.route("/register-student").post(controller.registerStudentDetails)
router.route("/register-tutor").post(controller.registerTutorDetails)
// router.route("/registerMail").post()
// router.route("/authenticate").post()
// router.route("/login").post()
// router.route("/register").post()
router.route("/send-otp").post(controller.sendOtp)
router.route("/forgot-psswd/:user").post(controller.forgotPsswd)
router.route("/reset-psswd/:id/:tk/:user").post(controller.resetPsswd)
//Get Requests

router.route("/student-mail-check").post(controller.studentMailExists) 
router.route("/tutor-mail-check").post(controller.tutorMailExists) 
router.route("/verify-otp").post(controller.verifyOtp)
router.route("/login-student").post(controller.loginStudent);
router.route("/login-tutor").post(controller.loginTutor);
router.route("/login-admin").post(controller.loginAdmin);
 
 
router.route("/reset-session").get(controller.reset)
//Put Requests

router.route("/updateUser").put()
router.route("/resetPassword").put()


//test
 
export default router