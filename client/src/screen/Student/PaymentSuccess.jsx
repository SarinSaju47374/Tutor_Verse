import {Link} from "react-router-dom"
import "../../scss/screen/Student/PaymentSuccess.scss"
import axios from "../../axios";
import { useEffect,useState } from "react"
import {toast} from "react-toastify"

const PaymentSuccess = () => {
  const [ready,setReady] = useState(false);
  useEffect(()=>{
    let sid = localStorage.getItem("SID")
    let data = JSON.parse(localStorage.getItem("bookingData"))
    if(data && sid){
      console.log("bravos");
      data.sid = sid;
      run(data)
    }else{
      console.log("Amigos")
    }
    async function run(data){
      let response = await axios.post("/booking",data);
      if(response.data.success){
        setReady(true);
        localStorage.setItem("bookingData",null)
        localStorage.setItem("SID",null)
      }else{
        toast.error("Something went Wrong")
        localStorage.setItem("bookingData",null)
        localStorage.setItem("SID",null)
      }
    }
    
  },[])
  return (
    <div className="content-success">
      <div className="data">
         Payment Successful 
          {ready ? <Link>Go to Bookings</Link> : "Loading ......."} 
       </div> 
    </div>
  )
}

export default PaymentSuccess
 