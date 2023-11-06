import { Route } from "react-router-dom";
import HomeTutor from "../layouts/HomeTutor.jsx";
import TutorProfile from "../screen/Tutor/TutorProfile.jsx";
import TutorHome from "../screen/Tutor/TutorHome.jsx";
import TutorPrivateRoutes from "../components/Tutor/TutorPrivateRoutes.jsx";
import BlogCreate from "../screen/Tutor/BlogCreate.jsx"
import Blogs from "../components/Common/Blogs.jsx";
import TutorBlogs from "../screen/Tutor/TutorBlogs.jsx";
import BlogUpdate from "../screen/Tutor/BlogUpdate.jsx";
import BlogPage from "../screen/BlogPage.jsx";
import StudentsBooked from "../screen/Tutor/StudentsBooked.jsx";
const tutorRoutes = (
  <Route path="/tutor" element={<TutorPrivateRoutes />}>
    <Route index element={<TutorHome />} />
    <Route path="profile" element={<TutorProfile/>} /> 
    <Route path="blog-create" element={<BlogCreate/>} /> 
    <Route path="blogs" element={<TutorBlogs/>} /> 
    <Route path="blogs/update/:bid" element={<BlogUpdate/>} /> 
    <Route path="blog/:bid" element={<BlogPage/>} /> 
    <Route path="bookings" element={<StudentsBooked />} /> 
  </Route>
);

export default tutorRoutes;
