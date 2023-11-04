import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux"
import axios from "../../axios"
import { useState } from "react"
import Navbar from "../../components/Student/Navbar"
import Footer from '../Student/Footer';

import {io} from "socket.io-client"
const ENDPOINT = import.meta.env.VITE_SERVER_URL;
 
import {logoutStudent,changeStatus} from "../../toolkit/slices/student/studentSlice.js"
const StudentPrivateRoutes = () => {
  let data = useSelector(state => state.student.user?.id);
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [loggedIn,setLoggedIn] = useState(false)
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const newSocket = io(ENDPOINT, { transports: ['websocket'] });
    async function verifyStudent() {   
      try {
        let response = await axios.get("/verify-studentv2");
        if (response.data.err) {
          setLoggedIn(false);
          dispatch(changeStatus(false));
          dispatch(logoutStudent());
          // navigate("/student/login")
        } else {
          // setReady(true)
          if(response.data.info.id == data){
            setLoggedIn(true);
            dispatch(changeStatus(true));
            setReady(true)
            
            if(newSocket && data){
              
              console.log("BAM VAM 1")
              newSocket.emit('joinNotificationRoom', data);
              newSocket.on('notification',(message)=>{
                console.log("BAM VAM 2")
                Notification.requestPermission()
                .then(perm=>{
                    if(perm==="granted"){
                        new Notification(`${message}`,{
                            body:"Be there on the Chats to Join the Room on Time!",
                            icon:"../../public/images/Website icon.png"
                        })
                    }
                })
              })
            }

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
    return () => {
      if (newSocket) {
        // newSocket.leave(data);
        newSocket.disconnect();
      }
    };
  }, [location.pathname]);

 

  

  return (
    <>
      <Navbar loggedIn={loggedIn} />
      <Outlet />
      <Footer />
    </>
  );
};

export default StudentPrivateRoutes;        