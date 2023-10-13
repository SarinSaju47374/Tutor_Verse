import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux"
import axios from "../../axios"
import { useState } from "react"
import TutorNavbar from '../Tutor/TutorNavbar';
 

const TutorPrivateChat = () => {
  let data = useSelector(state => state.tutor.user?.id);
  const location = useLocation();
  // const [tutor, setTutor] = useState(""); 
  const [ready, setReady] = useState(false);
  let loggedIn = true;
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyTutor() {
      try {
        let response = await axios.get("/verify-tutor");
        console.log(location.pathname)
        if (response.data.err) {
          navigate("/tutor/login")
        } else {
          // setReady(true)
          if(response.data.info.id == data){
            console.log()
            setReady(true)
          }else{
            navigate("/tutor/login")
          }
          console.log("redux state: ",data) 
          console.log("Respnse: ",response.data.info.id) 
        }
      } catch (error) {
        console.error("Error verifying tutor:", error);
      }
    }
    verifyTutor();
  }, [location.pathname]);

  if (!ready) {
    return null; // Render nothing while verifying
  }

  return (
    <>
      <TutorNavbar loggedIn={true} />
      <Outlet />
     
    </>
  );

  
};

export default TutorPrivateChat;        