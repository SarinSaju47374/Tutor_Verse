import {Outlet} from "react-router-dom"
import "../scss/layouts/adminPage.scss"
import AdminSidebar from "../components/Admin/AdminSidebar.jsx"
import AdminNav from "../components/Admin/AdminNav"
import AdminFooter from "../components/Admin/AdminFooter"
import {ToastContainer} from "react-toastify"
import { useEffect } from "react"
function HomeAdmin() {
  useEffect(()=>{},[])
  return (<>
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
  )
}

export default HomeAdmin