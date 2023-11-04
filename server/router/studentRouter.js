import {Router} from "express";
import * as studentController from "../controllers/studentController.js"
import { studentAuth } from "../middleware/authMiddleware.js";
import * as messageController from "../controllers/messageController.js"
const router = Router();

//Public  Routes   
router.route("/register-student").post(studentController.registerStudentDetails)

router.route("/student-mail-check").post(studentController.studentMailExists) 

router.route("/login-student").post(studentController.loginStudent);

router.route("/view-tutors").get(studentController.viewTutors);

router.route("/verify-student").get(studentController.verifyStudent);

router.route("/verify-studentv2").get(studentController.verifyStudentV2);

router.route("/view-tutor-det").get(studentController.viewTutorDet);

router.route("/tutor-slots-booked").post(studentController.tutorSlotsBooked);

//Private Routes

router.route("/payment-checkout").post(studentAuth,studentController.paymentCheckout);

router.route("/booking").post(studentAuth,studentController.booking);

router.route("/check-booking").post(studentAuth,studentController.checkBooking);

router.route("/load-chatrooms-student").get(studentAuth,studentController.loadChatRoomsStudent);

router.route("/add-messageS").post(studentAuth,messageController.AddMessage);

router.route("/load-messagesS").get(studentAuth,messageController.loadMessages);

router.route("/load-bookings").get(studentAuth,studentController.loadBookingList);

router.route("/readS").post(studentAuth,messageController.readMessage);

router.route("/cancellation-request").post(studentAuth,studentController.cancellationRequest);

router.route("/view-unread-messages").get(messageController.viewUnReadMessages);



     
 
 
export default router
