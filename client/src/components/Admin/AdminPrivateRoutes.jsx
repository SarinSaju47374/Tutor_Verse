import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux"
import axios from "../../axios"
import { useState } from "react"
import "../../scss/layouts/adminPage.scss"
import AdminSidebar from "./AdminSidebar.jsx"
import AdminNav from "./AdminNav.jsx"
import AdminFooter from "./AdminFooter.jsx"

const AdminPrivateRoutes = () => {
  let data = useSelector(state => state.admin.user?.id);
  const location = useLocation();
  // const [tutor, setTutor] = useState(""); 
  const [ready, setReady] = useState(false);
  let loggedIn = true;
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyAdmin() {
      try {
        let response = await axios.get("/verify-admin");
        if (response.data.err) {
          navigate("/admin/login")
        } else {
          // setReady(true)
          if(response.data.info.id == data){
            setReady(true)
          }else{
            navigate("/admin/login")
          }
        }
      } catch (error) {
        console.error("Error verifying tutor:", error);
      }
    }
    verifyAdmin();
  }, [location.pathname]);

  if (!ready) {
    return null; // Render nothing while verifying
  }

  return (
    <>
    <div className="main">
      <AdminNav/>
      <div className="container">
        <div className="menuContainer">
          <AdminSidebar/>
        </div>
        <div className="contentContainer">
          <Outlet/>
        </div>
      </div>
      <AdminFooter/>
    </div>
  </>
  );

  
};

export default AdminPrivateRoutes;        