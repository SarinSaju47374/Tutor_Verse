import {Router} from "express";
import * as studentController from "../controllers/studentController.js"
const router = Router();

//Public  Routes   
router.route("/register-student").post(studentController.registerStudentDetails)

router.route("/student-mail-check").post(studentController.studentMailExists) 

router.route("/login-student").post(studentController.loginStudent);

router.route("/view-tutors").get(studentController.viewTutors);

router.route("/verify-student").get(studentController.verifyStudent);

router.route("/verify-studentv2").get(studentController.verifyStudentV2);

router.route("/view-tutor-det").get(studentController.viewTutorDet);
    
 
 
export default router
