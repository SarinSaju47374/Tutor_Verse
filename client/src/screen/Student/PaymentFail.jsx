import React from 'react'
import {Link} from "react-router-dom"
import "../../scss/screen/Student/PaymentFail.scss"

const PaymentFail = () => {
  return (
    <div className="content-fail">
      <div className="data">
         Payment Cancelled
         <Link>Go to Courses</Link> 
       </div> 
    </div>
  )
}

export default PaymentFail
 