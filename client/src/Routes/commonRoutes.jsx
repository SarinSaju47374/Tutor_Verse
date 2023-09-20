import { Route } from "react-router-dom";

import RegisterTutor from "../layouts/RegisterTutor";
import RegisterStudent from "../layouts/RegisterStudent";
import ForgotPage from "../layouts/ForgotPage";
import ResetPassword from "../layouts/ResetPassword";
import LoginAdmin from "../layouts/LoginAdmin";
import LoginStudent from "../layouts/LoginStudent.jsx";
import LoginTutor from "../layouts/LoginTutor.jsx";

const commonRoutes = (
  <>
    <Route path="/login/student" element={<LoginStudent />} />
    <Route path="/register/student" element={<RegisterStudent />} />
    <Route path="/forgot/:user" element={<ForgotPage />} />
    <Route path="/reset-psswd/:id/:tk/:user" element={<ResetPassword />} />
    <Route path="/login/tutor" element={<LoginTutor />} />
    <Route path="/register/tutor" element={<RegisterTutor />} />
    <Route path="/login/admin" element={<LoginAdmin />} />
  </>
);

export default commonRoutes;
