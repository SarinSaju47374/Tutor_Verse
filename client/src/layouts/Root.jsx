import React from 'react'
import {Outlet} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function Root() {
  return (
    <>
    <ToastContainer/>
      <Outlet />
    </>
  )
}

export default Root
