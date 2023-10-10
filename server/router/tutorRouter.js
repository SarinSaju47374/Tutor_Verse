import {Router} from "express";
 
import * as tutorController from "../controllers/tutorController.js"
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


//Public
router.route("/register-tutor").post(tutorController.registerTutorDetails)

router.route("/tutor-mail-check").post(tutorController.tutorMailExists) 

router.route("/login-tutor").post(tutorController.loginTutor);

router.route("/verify-tutor").get(tutorController.verifyTutor);






 
export default router