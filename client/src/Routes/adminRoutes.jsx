import { Route } from "react-router-dom";
import HomeAdmin from "../layouts/HomeAdmin"
import AdminCourseTestAdd from "../screen/Admin/AdminCourseTestAdd.jsx";

const adminRoutes = (
  <Route path="/admin" element={<HomeAdmin />}>
    <Route index element={<>blah  </>} />
    <Route path="course-add" element={<AdminCourseTestAdd/>} />
  </Route>
);

export default adminRoutes;
