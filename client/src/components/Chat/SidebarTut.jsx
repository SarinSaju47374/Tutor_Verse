import React from 'react'

const SideBarTut = ({chatRooms,setCurrentRoom,socket}) => {

  function handleRoom(elem){
    setCurrentRoom(elem)
    if (socket && elem) {
      socket.emit('joinRoom', elem._id);
    }
  }
  console.log(chatRooms)
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
              <img src={elem.courseId.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj8YfthT5qAqBxYlpDNYvOUw8DlglgDoyVeA&usqp=CAU"} alt="" />
              <div className="details">
                <div className="name">
                  {elem.courseId.courseName}
                </div>
                <div className="mssg">
                  {elem.studentId.fName} {elem.studentId.lName} {elem.unreadMessages}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default SideBarTut
