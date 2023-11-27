import {useEffect,useState} from "react";
import axios from "../../axios"
import "../../scss/components/Admin/AdminNav.scss"
function AdminNav() {
  const [admin,setAdmin] = useState({});
  useEffect(()=>{
    async function run(){
      try{
        let response = await axios.get("/get-admin-data");
        if(response.data.admin){
          setAdmin(response.data.admin)
        }
      }catch(err){
        console.log(err)
      }
    }
    run()
  },[])
  return (
    <div className="admin-nav">
      <div className="logo">
        <img src="/images/tutorverse cyan logo.png" alt="" />
      </div>
      <div className="icons">
          <div className="user">
            <img src={admin.profilePhoto} alt="" />
            <span>{admin.fName}{" "}{admin.lName}</span>
          </div>
      </div>
    </div>
  )
}

export default AdminNav
