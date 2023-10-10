import { Route } from "react-router-dom";
import HomeTutor from "../layouts/HomeTutor.jsx";
import TutorProfile from "../screen/Tutor/TutorProfile.jsx";
import TutorHome from "../screen/Tutor/TutorHome.jsx";
import TutorPrivateRoutes from "../components/Tutor/TutorPrivateRoutes.jsx";
const tutorRoutes = (
  <Route path="/tutor" element={<TutorPrivateRoutes />}>
    <Route index element={<TutorHome />} />
    <Route path="profile" element={<TutorProfile/>} /> 
  </Route>
);

export default tutorRoutes;
