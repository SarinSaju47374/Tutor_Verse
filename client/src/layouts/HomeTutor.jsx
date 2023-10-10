import {useState,useEffect} from 'react'
import {Outlet} from "react-router-dom"
import TutorNavbar from '../components/Tutor/TutorNavbar';

 

import { loginTutor } from '../toolkit/slices/tutor/tutorSlice';

import Footer from '../components/Student/Footer';
function HomeTutor() {
   
 
  const[loggedIn,setLoggedIn] = useState(true);
  return (
    <>
        <TutorNavbar loggedIn={loggedIn}/>
        
        <Outlet loggedIn={loggedIn}/>
        
        <Footer />
    </>
  )
}

export default HomeTutor