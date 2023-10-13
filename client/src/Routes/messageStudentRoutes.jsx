import { Route } from "react-router-dom";
 
import Home from "../screen/Student/Home.jsx";
 
import StudentPrivateChat from "../components/Student/StudentPrivateChat.jsx";
import StudentChat from "../screen/Student/StudentChat.jsx";
 
const studentRoutes = (
  <Route path = "/" element={<StudentPrivateChat />}>
    <Route path="chat" element={<StudentChat />} />
  </Route>
);
export default studentRoutes;
