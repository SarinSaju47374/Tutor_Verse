import { Route } from "react-router-dom";
import HomeStudent from "../layouts/HomeStudent.jsx";
import Home from "../screen/Student/Home.jsx";
import CourseList from "../screen/CourseList.jsx";
import TutorList from "../screen/TutorList.jsx";
import CourseDescription from "../screen/Student/CourseDescription.jsx";
import TutorDescription from "../screen/Student/TutorDescription.jsx";
import StudentPrivateRoutes from "../components/Student/StudentPrivateRoutes.jsx";
import PaymentSuccess from "../screen/Student/PaymentSuccess.jsx";
import PaymentFail from "../screen/Student/PaymentFail.jsx";
import StudentChat from "../screen/Student/StudentChat.jsx";

const studentRoutes = (
  <Route element={<StudentPrivateRoutes />}>
    <Route index element={<Home />} />
    <Route path="courses" element={<CourseList/>} />
    <Route path="success" element={<PaymentSuccess/>} />
    <Route path="fail" element={<PaymentFail/>} />
    {/* <Route path="chat" element={<StudentChat/>} /> */}
    <Route path="course/:id" element={<CourseDescription/>} />
    <Route path="course/tutor/:courseId" element={<TutorList />} />
    <Route path="course/:courseId/:tutorId" element={<TutorDescription />} />
  </Route>
);
export default studentRoutes;
