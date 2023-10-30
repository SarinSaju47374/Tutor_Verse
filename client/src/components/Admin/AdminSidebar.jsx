import "../../scss/components/Admin/AdminSidebar.scss"
import {Link} from "react-router-dom";
function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="item">
        <span className="title">
          MAIN
        </span>
        <Link className="listItem" to="/admin/dashboard">
          <i className="fa-solid fa-table-columns"></i>
          <span className="listItemTitle">
            DashBoard
          </span>
        </Link>
        {/* <Link className="listItem">
          <i className="fa-solid fa-table-columns"></i>
          <span className="listItemTitle">
            Prompt
          </span>
        </Link> */}
      </div>
      
      <div className="item">
        <span className="title">
          TUTOR
        </span>
        <Link className="listItem" to="/admin/tutors">
          <i className="fa-solid fa-address-card"></i>
          <span className="listItemTitle">
            Tutors List
          </span>
        </Link>
        {/* <Link className="listItem">
          <i className="fa-solid fa-table-columns"></i>
          <span className="listItemTitle">
            Chat with Tutor
          </span>
        </Link> */}
      </div>
      <div className="item">
        <span className="title">
          STUDENT
        </span>
        <Link className="listItem" to="/admin/students">
         <i className="fa-solid fa-children"></i>
          <span className="listItemTitle">
            Students List
          </span>
        </Link>
         
      </div>
      <div className="item">
        <span className="title">
          Courses
        </span>
        <Link className="listItem" to="/admin/course-add">
          <i className="fa-solid fa-book"></i>
          <span className="listItemTitle">
            Course List
          </span>
        </Link>
        {/* <Link className="listItem">
          <i className="fa-solid fa-table-columns"></i>
          <span className="listItemTitle">
            Add Course
          </span>
        </Link> */}
         
      </div>
    </div>
  )
}

export default AdminSidebar
