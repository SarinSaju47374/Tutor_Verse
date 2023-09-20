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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {commonRoutes}
      {studentRoutes}
      {tutorRoutes}
      {adminRoutes}
    </Route>
  )
);

export default router;
