import {Router} from "express";
import * as courseController from "../controllers/courseController.js"
const router = Router();

// Post Requests    
router.route("/course-add").post(courseController.courseAdd)


//Get Requests
router.route("/course-view").get(courseController.courseView);
router.route("/course-hide").patch(courseController.courseHide);
router.route("/course-modify").post(courseController.courseUpdate);
router.route("/course-modify").post(courseController.courseUpdate);
router.route("/course-desc").get(courseController.courseDesc);
// router.route("/course-view").post(courseController.courseList) 

 

 
 
export default router