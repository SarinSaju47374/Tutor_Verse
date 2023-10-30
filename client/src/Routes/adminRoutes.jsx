import { Route } from "react-router-dom";
import HomeAdmin from "../layouts/HomeAdmin"
import AdminCourseTestAdd from "../screen/Admin/AdminCourseTestAdd.jsx";
import AdminTutorList from "../screen/Admin/AdminTutorList.jsx";
import AdminPrivateRoutes from "../components/Admin/AdminPrivateRoutes";
import AdminDashBoard from "../screen/Admin/AdminDashBoard";
import AdminStudentList from "../screen/Admin/AdminStudentList";

const adminRoutes = (
  <Route path="/admin" element={<AdminPrivateRoutes />}>
    <Route path="dashboard" element={<AdminDashBoard />} />
    <Route path="tutors" element={<AdminTutorList />} />
    <Route path="students" element={<AdminStudentList />} />
    <Route path="course-add" element={<AdminCourseTestAdd />} />
  </Route>
);

export default adminRoutes;
