import { Route } from "react-router-dom";
import HomeTutor from "../layouts/HomeTutor.jsx";

const tutorRoutes = (
  <Route path="/tutor" element={<HomeTutor />}>
    <Route index element={<h1>This is your DashBoard Tutor</h1>} />
  </Route>
);

export default tutorRoutes;
