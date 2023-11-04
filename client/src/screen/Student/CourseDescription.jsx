import React, { useEffect, useState } from 'react'
import "../../scss/screen/Student/CourseDescription.scss"
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../axios';

function CourseDescription() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    async function run() {
      let response = await axios.get("/course-desc", {
        params: {
          id: id
        }
      })
      setData(response.data);
    }
    run()

  }, [])

  return (
    <div className='content-desc'>
      <div className="det">
        <div className="info">
          <div className="breadCrumbs">
            <Link to="/">Home</Link> <span>&#62;</span>
            <Link to="/courses">Courses</Link> <span>&#62;</span>
            <Link className="active">Course Description</Link>
          </div>
          <h3>{data.courseName}</h3>
          <h4>{data.board}</h4>
          <p style={{ margin: "0" }}>Course Duration : {data.duration} months</p>

        </div>

      </div>
      <div className="course-desc">
        <div className="desc">
          {data.desc}
        </div>
        <div className="course-actions">
          <div className="image">
            <img src={data.image} alt="" />
          </div>
          <div className="instructions">
            <p><i className="fa-solid fa-people-group"></i>    1000+ teachers available nearby</p>
            <p><i className="fa-solid fa-laptop"></i>    Personalized learning</p>
            <p><i className="fa-solid fa-circle-play"></i>     Free trial demo</p>
          </div>
          <div className="actions">
              <Link to={`/course/tutor/${data._id}`}><i className="fa-solid fa-user-large"></i> View Tutors</Link>    
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDescription
