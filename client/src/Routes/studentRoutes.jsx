import { Route } from "react-router-dom";
import HomeStudent from "../layouts/HomeStudent.jsx";
import Home from "../screen/Student/Home.jsx";
import CourseList from "../screen/CourseList.jsx";
import TutorList from "../screen/TutorList.jsx";
import CourseDescription from "../screen/Student/CourseDescription.jsx";
import TutorDescription from "../screen/Student/TutorDescription.jsx";
import StudentPrivateRoutes from "../components/Student/StudentPrivateRoutes.jsx";
const studentRoutes = (
  <Route element={<StudentPrivateRoutes />}>
    <Route index element={<Home />} />
    <Route path="courses" element={<CourseList/>} />
    <Route path="course/:id" element={<CourseDescription/>} />
    <Route path="course/tutor/:courseId" element={<TutorList />} />
    <Route path="course/:courseId/:tutorId" element={<TutorDescription />} />
  </Route>
);
export default studentRoutes;
