import {useRef,useEffect} from 'react';

const MainMessages = ({ messages, id ,currentRoom}) => {
  const myRef = useRef(null);

  useEffect(() => {
    myRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  console.log("😍",currentRoom)
  return (
    <div className="chat">
      <div className="chat-data">
        {messages && messages.length > 0 ? (
          messages.map(elem => {
            if (elem.senderId == id) { // <-- Corrected here
              
              return (
                <div className="mssg-spec" key={elem._id}> {/* Don't forget to add a unique key */}
                  <div className="sender">
                    <img src="https://www.verywellmind.com/thmb/pwEmuUJ6KO9OF8jeiQCDyKnaVQI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1187609003-73c8baf32a6a46a6b84fe931e0c51e7e.jpg" alt="" />
                    <div className="mssg-data">
                      {elem.message}
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div className="mssg-spec" key={elem._id}> {/* Don't forget to add a unique key */}
                  <div className="reciever">
                    <img src="https://www.verywellmind.com/thmb/pwEmuUJ6KO9OF8jeiQCDyKnaVQI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1187609003-73c8baf32a6a46a6b84fe931e0c51e7e.jpg" alt="" />
                    <div className="mssg-data">
                      {elem.message}
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
              currentRoom && messages.length<1 ? <>No messages Here</> : <>Choose the Chat room</>
              
            }
          </div>
        )}
        <div ref={myRef}></div>
      </div>
    </div>
  )
}

export default MainMessages;
