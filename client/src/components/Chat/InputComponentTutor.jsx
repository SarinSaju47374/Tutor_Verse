import {useState} from 'react'
import axios from "../../axios"; 
import {v1 as uuid} from "uuid";
import { useNavigate } from 'react-router-dom';
const InputComponentTutor = ({socket,currentRoomId,id}) => {
  const [value,setValue] = useState("")
  const navigate = useNavigate();

   async function createRoom() {
   
    const response = await axios.get("/create-room-link")
    console.log(response.data.link)
    if (socket && currentRoomId) {
      const messageWithButton = `
        <div className="bazinga">
          <p>Click the button below to join the room:</p>
          <a href="${response.data.link}" target="_blank">
            <button>Join Room</button>
          </a>
        </div>
      `;

      // Assuming 'messageWithButton' and 'id' are defined
      await axios.post("/add-messageS", {
        roomId: currentRoomId,
        message: messageWithButton,
        senderId: id
      });

      socket.emit('sendMessage', currentRoomId, {
        message: messageWithButton, 
        senderId: id
      });
    }
  }

  const handleSendMessage = async (message) => {
    if (socket && currentRoomId) {
       
      await axios.post("/add-messageS",{
        roomId:currentRoomId,
        message:message.replace(/\n/g, " "),
        senderId:id
      })
      socket.emit('sendMessage', currentRoomId, {
        message:message, 
        senderId:id
      });
    }
  };
  
  return (
    <div className="chat-input">
      <label htmlFor="upload"><i className="fa-solid fa-paperclip"></i></label>
      <input type="file" multiple id="upload" hidden/>
      <textarea 
        name="" 
        id="inp-chat  " 
        cols="30" 
        rows="10" 
        placeholder='Enter your message' 
        value = {value}
        onChange = {(e)=>{setValue(e.target.value)}}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault(); // Prevents the default behavior of the Enter key
            handleSendMessage(value);
            setValue("")
          }
        }}

      ></textarea>
      <i className="fa-solid fa-paper-plane" onClick={()=>handleSendMessage(value)}></i>
      <button onClick={()=>createRoom()}>Create Room</button> 
    </div>
  )
}

export default InputComponentTutor
