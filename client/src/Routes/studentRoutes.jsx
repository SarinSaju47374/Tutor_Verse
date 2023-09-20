import { Route } from "react-router-dom";
import HomeStudent from "../layouts/HomeStudent.jsx";

const studentRoutes = (
  <Route element={<HomeStudent />}>
    <Route index element={<h1>Hello</h1>} />
    <Route path="courses" element={<h1>Courses</h1>} />
  </Route>
);
export default studentRoutes;
