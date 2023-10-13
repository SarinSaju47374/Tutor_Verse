import {useState} from 'react';
import axios from "../../axios";

const InputComponentStudent = ({socket,currentRoomId,id}) =>{
  const [value,setValue] = useState("")
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
       
    </div>
  )
}

export default InputComponentStudent