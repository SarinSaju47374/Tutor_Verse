import {useEffect,useState} from 'react';
import {Link} from "react-router-dom";
import axios from  "../../axios";
import {toast} from "react-toastify"
import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux'
import "../../scss/screen/Student/TutorDescription.scss";
import StripeCheckout from "react-stripe-checkout"
function TutorDescription(  ) {
  const studentInfo = useSelector(state=>state.student.user)
  let loggedIn = useSelector(state => state.student?.loggedIn);
  const {courseId,tutorId} = useParams();
  const [data,setData] = useState({});
  const [slots,setSlots] = useState([]);
  useEffect(() => {
    async function run() {
      let response = await axios.get(`/view-tutor-det?courseId=${courseId}&tutorId=${tutorId}`);
      setData(response.data)
      setSlots(response.data.slots)
      let info = await axios.get('/verify-student')
    }
    run()
  }, [])

  console.log(slots)
  async function handleSubmit(e,token){
    // e.preventDefault();
    let response = await axios.get("/verify-student"); 
    if(response.data.err){
      toast.error(response.data.err)
    }else{
      let body = {
        
      }
    }
  }
  console.log("logged In:- ",loggedIn)
  return (
    <div className="content" style={{ marginTop: "22px" }}>
      <div className="det">
        <div className="info">
          <div className="breadCrumbs">
            <Link >Home</Link> <span>></span>
            <Link to={`/course/${data.course?._id}`}>Course Description</Link> <span>></span>
            <Link to={`/course/tutor/${data.course?._id}`}>Tutor List</Link> <span>></span>
            <Link className="active">Tutor Description</Link>
          </div>
          <h3>{data?.course?.courseName}</h3>
          <h4>{data?.course?.board}</h4>
          <p style={{ margin: "0" }}>Duration :- {data?.course?.duration } months</p>

        </div>
        
      </div>
      
      {
        data.tutor?._id &&
        <div className="data">
          <img src={data?.tutor?.profilePhoto} alt="" />
          <div className="details dett">
            <h3>Name: {data?.tutor?.fName}{"  "}{data?.tutor?.lName}</h3>
            <h3>Experience : {data?.tutor?.expYear} years</h3>
            <h3>Course Fee : <span>₹ {data?.course?.price} </span></h3>
            
          </div>
          <form className="details">
            <select name="slot" id="slot" onChange={(e)=>{
              console.log(e.target.value)
            }}>
              <option value="" disabled>Choose your Time Slot</option>
              {
                slots.length>0 && slots.map((data,index)=>
                  <option value={JSON.stringify({
                    value:data?.value,
                    label:data?.label})
                  }>{data.label}</option>
                )
              }
            </select>
            {/* <button onClick={handleSubmit}>Book your Slot</button> */}
            {loggedIn ? <StripeCheckout
              stripeKey={import.meta.env.VITE_STRIPE_KEY}
              amount = {data?.course?.price*100}
              email={studentInfo?.email}
              currency='inr'
              token={handleSubmit}

            >
              <button>Book your Slot</button>
            </StripeCheckout>
          :
          <Link to="/student/login">First Login to Book</Link>  
          }
          </form>
      </div>
      }
      
       
  </div>
  )
}

export default TutorDescription
