import React, { useEffect, useState } from 'react';
import axios from "../../axios";
import BookingComponent from '../../components/Common/BookingComponent';
import "../../scss/screen/Student/BookingsStudent.scss";

function BookingsStudent() {
    const [data,setData] = useState([]);
    
    useEffect(()=>{
        async function run(){
            let response = await axios.get("/load-bookings")
            setData(response.data)
        }
        run()
    },[])
    console.log(data)
  return (
    <div className="booking-list-parent">
    <h1>Your Bookings</h1>
      <BookingComponent data={data}/>
    </div>
  )
}

export default BookingsStudent
