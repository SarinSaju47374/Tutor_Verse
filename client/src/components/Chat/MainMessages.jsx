import { useRef, useEffect } from 'react';
import axios from "../../axios"
import {toast} from "react-toastify"
const MainMessages = ({ messages, id, currentRoom,profile }) => {
  const myRef = useRef(null);
  // let data = useSelector(state => state.student.user?.id)
  const isHTML = (str) => /<[a-z][\s\S]*>/i.test(str);
  useEffect(() => {
    myRef.current?.scrollIntoView({ behavior: 'smooth' });
    
  }, [messages]);
  useEffect(()=>{
    async function readBy(){
      let response = await axios.post("/readS",{roomId:currentRoom});
      if(response.success){
        toast.success("Hurrah")
      }
    }
    readBy();
  },[currentRoom])
  
  return (
    <div className="chat">
      <div className="chat-data">
        {messages && messages.length > 0 ? (
          messages.map(elem => {
            if (elem.senderId == id) { // <-- Corrected here

              return (
                <div className="mssg-spec" key={elem._id}> {/* Don't forget to add a unique key */}
                  <div className="sender">
                    {/* <img src={profile} alt="" /> */}
                    <div className="mssg-data">
                      {/* {elem.message} */}
                      {isHTML(elem.message) ? (
                        <div dangerouslySetInnerHTML={{ __html: elem.message }} />
                      ) : (
                        elem.message
                      )}
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div className="mssg-spec" key={elem._id}> {/* Don't forget to add a unique key */}
                  <div className="reciever">
                    {/* <img src={"https://www.verywellmind.com/thmb/pwEmuUJ6KO9OF8jeiQCDyKnaVQI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1187609003-73c8baf32a6a46a6b84fe931e0c51e7e.jpg"} alt="" /> */}
                    <div className="mssg-data">
                      {/* {elem.message} */}
                      {isHTML(elem.message) ? (
                        <div dangerouslySetInnerHTML={{ __html: elem.message }} />
                      ) : (
                        elem.message
                      )}
                    </div>
                  </div>
                </div>
              )
            }
          })
        ) : (
          <div className="choose-room">
            <img src="/images/tutorverse cyan logo.png" alt="" />
            {
              currentRoom && messages.length < 1 ? <>No messages Here</> : <>Choose the Chat room</>

            }
          </div>
        )}
        <div ref={myRef}></div>
      </div>
    </div>
  )
}

export default MainMessages;
