import React from 'react'
import {Outlet} from "react-router-dom"
function HomeAdmin() {
  return (
    <>
      Sidebar
      <Outlet/>
    </>
  )
}

export default HomeAdmin