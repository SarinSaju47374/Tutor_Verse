import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify"
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import "../../scss/screen/Student/TutorDescription.scss";
import StripeCheckout from "react-stripe-checkout"
function TutorDescription() {

  const studentInfo = useSelector(state => state.student.user)
  let loggedIn = useSelector(state => state.student?.loggedIn);
  const { courseId, tutorId } = useParams();
  const [data, setData] = useState({});
  const [slots, setSlots] = useState([]);
  const [bookedTutorSlots, setBookedTutorSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([])
  const [bkd,setBkd] = useState([])
  const [booked, setBooked] = useState(false)
  const [slot, setSlot] = useState({});
  const [redirect, setRedirect] = useState("");
  const [shaking, setShaking] = useState(false);
  const handleClick = () => {
    setShaking(true);

    setTimeout(() => {
      setShaking(false);
    }, 500); // Remove the class after 0.5 seconds (matching the animation duration)
  };
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      let response = await axios.get(`/view-tutor-det?courseId=${courseId}&tutorId=${tutorId}`);
      setData(response.data)
      setSlots(response.data.slots)
      let info = await axios.get('/verify-student')
      let bookedTutorSlotA = await axios.post('/tutor-slots-booked', { tutorId })
      console.log("🛺🛺🛺🛺🛺",bookedTutorSlotA.data)
      setBookedTutorSlots(bookedTutorSlotA.data.slots)
      if (loggedIn) {
        let response = await axios.post("/check-booking", {
          tutorId,
          courseId
        })
        if (response.data.booked) {
          setBooked(true)
        }
      }
    }
    run()
  }, [])

  //THis useEffect runs at second render ⛔
  useEffect(() => {
    function getObjectKey(obj) {
      return obj.value + obj.label;
    }
    let bookd = bookedTutorSlots.map(getObjectKey);
    setBkd(bookd);
    if(bookedTutorSlots  .length>0){
      let unique = slots.filter(item => !bookd.includes(getObjectKey(item)));
      setAvailableSlots(unique)
    }else{
      setAvailableSlots(slots)
    }
  }, [bookedTutorSlots, slots])
   
  function getObjectKey(obj) {
      return obj.value + obj.label;
    }


  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(slot).length > 1) {
      console.log(slot)
      let booking = {
        courseId: data?.course?._id,
        tutorId: data?.tutor?._id,
        slot: slot
      }
      localStorage.setItem("bookingData", JSON.stringify(booking))
      let response = await axios.post("/payment-checkout", {
        price: data?.course?.price,
        courseName: data?.course?.courseName,
        courseId: data?.course?.id,
        tutorId: data?.tutor?._id,
        slot
      });
      if(response.data.err){
        toast.error(response.data.err)
      }
      if (response.data.url) {
        localStorage.setItem("SID",response.data.sId)
        setRedirect(response.data.url)
      }
    } else {
      toast.error("Choose the Time Slot")
    }
 
  }
  if (redirect) {
    window.location = redirect
  }
  
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
          <p style={{ margin: "0" }}>Duration :- {data?.course?.duration} months</p>

        </div>

      </div>

      {
        data.tutor?._id &&
        <div className="data">
          <img src={data?.tutor?.profilePhoto} alt="" />
          <div className="details">
            <div className="refer" >
              <span style={{color:"rgba(255, 145, 0, 0.853)",fontWeight:"600"}}>
                <i className="fa-solid fa-circle" ></i>{"  "}
                Booked
              </span>
              <span style={{color:"rgba(35, 201, 187, 0.849)",fontWeight:"600"}}> 
                <i className="fa-solid fa-circle" ></i>{"  "}
                Available
              </span>
            </div>
            <div className="details dett">
              <h3>Name: {data?.tutor?.fName}{"  "}{data?.tutor?.lName}</h3>
              <h3>Experience : {data?.tutor?.expYear} years</h3>
              <h3>Course Fee : <span>₹ {data?.course?.price} </span></h3>
            </div>
            <div className="slotPreview">
              {
                slots.map(slot => {
                  if (bkd.includes(getObjectKey(slot))) {
                    return <div className="red tile-slot" key={getObjectKey(slot)}>{slot.label}</div>
                  } else {
                    return <div className="blue tile-slot" key={getObjectKey(slot)}>{slot.label}</div>
                  }
                })
              }
            </div>
          </div>
          {
            !booked ?
              <form className="details">
                <label htmlFor="slot">Choose your Time Slot</label>
                <select name="slot" id="slot" onChange={(e) => {
                  console.log(e.target.value)
                  if(e.target.value!="rrr"){
                    setSlot(JSON.parse(e.target.value)) 
                  }else{
                    setSlot({})
                  }
                }}>
                  <option value="rrr">Choose your Time Slot</option>
                  {
                    availableSlots.length > 0 && availableSlots.map((data, index) =>
                      <option value={JSON.stringify({
                        value: data?.value,
                        label: data?.label
                      })
                      } key={index}>{data.label}</option>
                    )
                  }
                </select>
                {/* <button onClick={handleSubmit}>Book your Slot</button> */}
                {loggedIn ?
                  <button type="submit" onClick={handleSubmit}>Book your Slot</button>

                  :
                  <Link to="/student/login">First Login to Book</Link>
                }
              </form>
              :
              <div
                className={shaking ? 'booked shake' : 'booked'}
                onClick={handleClick}
              >Booked</div>
          }
        </div>
      }


    </div>
  )
}

export default TutorDescription


