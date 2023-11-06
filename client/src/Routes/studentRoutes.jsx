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
import StudentBlogs from "../screen/Student/StudentBlogs.jsx";
import BlogPageStudent from "../screen/BlogPageStudent.jsx";
import BookingsStudent from "../screen/Student/BookingsStudent.jsx"
import AboutPage from "../screen/AboutPage.jsx";
import ContactUsPage from "../screen/ContactUsPage.jsx";
 
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
    <Route path="blogs" element={<StudentBlogs />} />
    <Route path="blog/:bid" element={<BlogPageStudent/>} /> 
    <Route path="bookings" element={<BookingsStudent/>} /> 
    <Route path="about-us" element={<AboutPage/>} /> 
    <Route path="contact-us" element={<ContactUsPage/>} /> 
  </Route>
);
export default studentRoutes;
