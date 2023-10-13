import { Route } from "react-router-dom";
 
import Home from "../screen/Student/Home.jsx";
 
import TutorPrivateChat from "../components/Tutor/TutorPrivateChat.jsx";
import TutorChat from "../screen/Tutor/TutorChat.jsx";
 
const studentRoutes = (
  <Route path = "/tutor" element={<TutorPrivateChat />}>
    <Route path="chat" element={<TutorChat />} />
  </Route>
);
export default studentRoutes;
