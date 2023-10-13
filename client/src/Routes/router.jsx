import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Root from "../layouts/Root.jsx";
//Routes

import commonRoutes from "./commonRoutes.jsx";
import studentRoutes from "./studentRoutes.jsx";
import adminRoutes from "./adminRoutes.jsx";
import tutorRoutes from "./tutorRoutes.jsx";
import messageStudentRoutes from "./messageStudentRoutes.jsx"
import messageTutorRoutes from "./messageTutorRoutes.jsx"
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {commonRoutes}
      {studentRoutes}
      {tutorRoutes}
      {adminRoutes}
      {messageStudentRoutes}
      {messageTutorRoutes}
    </Route>
  )
);

export default router;
