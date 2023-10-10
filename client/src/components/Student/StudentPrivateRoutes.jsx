import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux"
import axios from "../../axios"
import { useState } from "react"
import Navbar from "../../components/Student/Navbar"
import Footer from '../Student/Footer';
import {logoutStudent,changeStatus} from "../../toolkit/slices/student/studentSlice.js"
const StudentPrivateRoutes = () => {
  let data = useSelector(state => state.student.user?.id);
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [loggedIn,setLoggedIn] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    async function verifyStudent() {
      try {
        let response = await axios.get("/verify-studentv2");
        if (response.data.err) {
          setLoggedIn(false);
          // navigate("/student/login")
        } else {
          // setReady(true)
          if(response.data.info.id == data){
            setLoggedIn(true);
            dispatch(changeStatus(true));
            setReady(true)
          }else{ 
            setLoggedIn(false)
            dispatch(changeStatus(false));
            dispatch(logoutStudent());
          }
          // console.log("redux state: ",data) 
          // console.log("Respnse: ",response.data.info.id) 
        }
      } catch (error) {
        console.error("Error verifying tutor:", error);
      }
    }
    verifyStudent();
  }, [location.pathname]);

 

  // if (!ready) {
  //   return null; // Render nothing while verifying
  // }

  return (
    <>
      <Navbar loggedIn={loggedIn} />
      <Outlet />
      <Footer />
    </>
  );
};

export default StudentPrivateRoutes;        