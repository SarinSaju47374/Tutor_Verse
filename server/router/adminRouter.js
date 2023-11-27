import {Router} from "express";
import * as adminController from "../controllers/adminController.js"
import { adminAuth } from "../middleware/authMiddleware.js";
const router = Router();



//Private
router.route("/get-admin-data").get(adminAuth,adminController.getAdminData);
router.route("/admin-tutor-view").get(adminAuth,adminController.adminTutorView);
router.route("/admin-student-view").get(adminAuth,adminController.adminStudentView);
router.route("/chart-bookings").get(adminAuth,adminController.chartBookings);
router.route("/tut-stud-count").get(adminAuth,adminController.tutStudCount);
router.route("/get-student").get(adminAuth,adminController.getStudent);
router.route("/get-student-bookings").get(adminAuth,adminController.getStudentBookings);
router.route("/approve-cancellation").put(adminAuth,adminController.approveCancellation);   
router.route("/disapprove-cancellation").put(adminAuth,adminController.disapproveCancellation);   
router.route("/block-tutor").post(adminAuth,adminController.blockTutor);   
router.route("/unblock-tutor").post(adminAuth,adminController.unblockTutor);   
router.route("/tutor-schedule").get(adminAuth,adminController.getTutorSchedule); 

//Public
router.route("/login-admin").post(adminController.loginAdmin);
router.route("/verify-admin").get(adminController.verifyAdmin);
 
 

 
 
export default router