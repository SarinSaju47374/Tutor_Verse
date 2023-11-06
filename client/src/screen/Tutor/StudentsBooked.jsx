import React, { useEffect, useState } from 'react';
import axios from "../../axios";
import "../../scss/screen/Student/BookingsStudent.scss";
import BookingStudentComponent from '../../components/Tutor/BookingStudentComponent';

function StudentsBooked() {
    const [data,setData] = useState([]);
    const [mod,setMod] = useState(false); //this triggers any modification in page
    useEffect(()=>{
        async function run(){
            let response = await axios.get("/load-stud-bookings")
            setData(response.data)
        }
        run()
    },[mod])
    console.log(data)
  return (
    <div className="booking-list-parent">
    <h1>Your Bookings</h1>
      <BookingStudentComponent data={data} setMod={setMod} mod={mod}/>
    </div>
  )
}

export default StudentsBooked
