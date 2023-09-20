import {Router} from "express";
 
import * as tutorController from "../controllers/tutorController.js"
const router = Router();

// Post Requests    

router.route("/register-tutor").post(tutorController.registerTutorDetails)

router.route("/tutor-mail-check").post(tutorController.tutorMailExists) 

router.route("/login-tutor").post(tutorController.loginTutor);


 
export default router