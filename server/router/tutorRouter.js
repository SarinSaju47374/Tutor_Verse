import {Router} from "express";
 
import * as tutorController from "../controllers/tutorController.js"
import * as messageController from "../controllers/messageController.js"
import * as commonController from "../controllers/commonController.js"
import { tutorAuth } from "../middleware/authMiddleware.js";
const router = Router();
import multer from "multer"
const upload = multer({ dest: 'uploads/' });
//Private
function logFields(error,req, res, next) {
    console.log("Rejected fields:", error);
    next();
}

router.route("/tutor-details").get(tutorAuth, tutorController.tutorDetails);

router.route("/tutor-update").post(tutorAuth, tutorController.tutorUpdate);

router.route("/tutor-doc-upload").post(tutorAuth, upload.array("pdfs"),logFields,tutorController.tutorDocUpload);

router.route("/save-slot").post(tutorAuth, tutorController.saveSlot);

router.route("/update-slot").post(tutorAuth, tutorController.updateSlot);

router.route("/view-slots").get(tutorAuth, tutorController.viewSlots);

router.route("/slot-delete").delete(tutorAuth, tutorController.slotDelete);

router.route("/load-chatrooms-tutor").get(tutorAuth,tutorController.loadChatRoomsTutor);

router.route("/add-messageT").post(tutorAuth,messageController.AddMessage);

router.route("/load-messagesT").get(tutorAuth,messageController.loadMessages);

router.route("/add-blog").post(tutorAuth,tutorController.addBlog);

router.route("/update-blog").post(tutorAuth,tutorController.updateBlog);

router.route("/delete-blog").delete(tutorAuth,tutorController.deleteBlog);

router.route("/readT").get(tutorAuth,messageController.readMessage);

router.route("/create-room-link").get(tutorAuth,commonController.roomLink);

router.route("/load-stud-bookings").get(tutorAuth,tutorController.loadStudentsBookingList);


//Public
router.route("/register-tutor").post(tutorController.registerTutorDetails)

router.route("/tutor-mail-check").post(tutorController.tutorMailExists) 

router.route("/login-tutor").post(tutorController.loginTutor);

router.route("/verify-tutor").get(tutorController.verifyTutor);

router.route("/view-blog").get(commonController.viewBlog);







 
export default router