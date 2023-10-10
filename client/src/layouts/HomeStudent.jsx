import {useState} from 'react'
import {Outlet} from "react-router-dom"
import Navbar from '../components/Student/Navbar'
import Footer from '../components/Student/Footer'
import "../scss/layouts/studentsPage.scss"
function HomeStudent() {
  const[loggedIn,setLoggedIn] = useState(false);
  return (
    <>
        <Navbar loggedIn={loggedIn}/>
        <Outlet loggedIn={loggedIn}/>
        <Footer />
    </>
  )
}

export default  HomeStudent