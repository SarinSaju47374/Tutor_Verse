import React from 'react'

const SideBar = ({chatRooms,setCurrentRoom,socket}) => {

  function handleRoom(elem){
    setCurrentRoom(elem)
    if (socket && elem) {
      socket.emit('joinRoom', elem._id);
    }
  }
  return (
    <div className="users">
        <div className="search">
          <div className="search-bar">
            <input type="text" placeholder="Search for Users"/>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <div className="names">
          {chatRooms && chatRooms.map((elem, index) => (
            <div key={index} className="user" onClick = {()=>handleRoom(elem)}>
              <img src={elem.courseId.image} alt="" />
              <div className="details">
                <div className="name">
                  {elem.courseId.courseName}
                </div>
                <div className="mssg">
                  {elem.tutorId.fName} {elem.tutorId.lName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default SideBar
