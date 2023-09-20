import { Route } from "react-router-dom";
import HomeAdmin from "../layouts/HomeAdmin.jsx";

const adminRoutes = (
  <Route path="/admin" element={<HomeAdmin />}>
    <Route index element={<h1>This is your DashBoard admin</h1>} />
  </Route>
);

export default adminRoutes;
