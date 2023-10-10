import "../../scss/components/Admin/AdminNav.scss"
function AdminNav() {
  return (
    <div className="admin-nav">
      <div className="logo">
        <img src="/images/tutorverse cyan logo.png" alt="" />
      </div>
      <div className="icons">
          <div className="notifications">
            <i className="fa-solid fa-bell"></i>
            <span>2</span>
          </div>
          <div className="user">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4rsSzLimlQyniEtUV4-1raljzFhS45QBeAw&usqp=CAU" alt="" />
            <span>Jane</span>
          </div>
      </div>
    </div>
  )
}

export default AdminNav
