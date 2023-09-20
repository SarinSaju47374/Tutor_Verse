import {Router} from "express";
import * as studentController from "../controllers/studentController.js"
const router = Router();

// Post Requests    
router.route("/register-student").post(studentController.registerStudentDetails)

router.route("/student-mail-check").post(studentController.studentMailExists) 

router.route("/login-student").post(studentController.loginStudent);

 
 
export default router
