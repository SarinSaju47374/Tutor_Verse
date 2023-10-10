import { Route } from "react-router-dom";

import RegisterTutor from "../screen/Tutor/RegisterTutor";  
import RegisterStudent from "../screen/Student/RegisterStudent";
import ForgotPage from "../screen/ForgotPage"
import ResetPassword from "../screen/ResetPassword";
import LoginAdmin from "../screen/Admin/LoginAdmin"
import LoginStudent from "../screen/Student/LoginStudent" 
import LoginTutor from "../screen/Tutor/LoginTutor";

const commonRoutes = (
  <>
    <Route path="/student/login" element={<LoginStudent />} />
    <Route path="/student/register" element={<RegisterStudent />} />
    <Route path="/forgot/:user" element={<ForgotPage />} />
    <Route path="/reset-psswd/:id/:tk/:user" element={<ResetPassword />} />
    <Route path="/tutor/login" element={<LoginTutor />} />
    <Route path="/tutor/register" element={<RegisterTutor />} />
    <Route path="/admin/login" element={<LoginAdmin />} />
  </>
);

export default commonRoutes;
