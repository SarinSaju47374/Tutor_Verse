import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage,FieldArray } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import axios from "../../axios"
import Tilt from 'react-parallax-tilt';
import "../../scss/screen/Tutor/TutorHome.scss"
import {useNavigate} from "react-router-dom";

function TutorHome() {
  const navigate = useNavigate();
   
  return (
     <div className="TutorHome">
        <Link>
          <Tilt>
            <div className="card card-1">
              <h2>Students Allocated</h2>
            </div>
          </Tilt>
        </Link>
        <Link to="/tutor/profile">
          <Tilt>
            <div className="card card-2">
              <h2>Your Profile</h2>
            </div>
          </Tilt>
        </Link>
        <Link to="/tutor/chat">
          <Tilt>
            <div className="card card-3">
              <h2>Chats</h2>
            </div>
          </Tilt>
        </Link>
        <Link to="/tutor/blogs">
          <Tilt>
            <div className="card card-4">
              <h2>Blogs</h2>
            </div>
          </Tilt>
        </Link>
     </div>
  );
}

export default TutorHome
