import { useState,useEffect } from 'react'
import {useSelector} from "react-redux"
import "../../scss/screen/Student/StudentChat.scss";
import SideBarStud from '../../components/Chat/SideBarStud';
import MainMessages from '../../components/Chat/MainMessages';
import InputComponent from '../../components/Chat/InputComponentTutor';
import InputComponentStudent from '../../components/Chat/InputComponentStudent';
import axios from "../../axios"
import {io} from "socket.io-client"
const ENDPOINT = import.meta.env.VITE_SERVER_URL;
// const socket = io(ENDPOINT , {transports:['websocket']})


const StudentChat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  let studentId = useSelector(state => state.student.user?.id);
  
  useEffect(() => {
    const newSocket = io(ENDPOINT, { transports: ['websocket'] });
    setSocket(newSocket);

    async function fetchChatRooms() {
      try {
        const response = await axios.get('/load-chatrooms-student');
        if (response.data) {
          setChatRooms(response.data);
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    }

    fetchChatRooms();

    if (newSocket) {
      newSocket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);
   useEffect(()=>{
      console.log("✈✈✈✈")
      async function fetchMessages(){
        let response = await axios.get("/load-messagesS",{
          params:{
            roomId:currentRoom?._id
          }
        })
       console.log(response.data.messages)
        if(response.data.empty) {
          setMessages([])
        }else{
          console.log("|asdfasdfasdfaasdfaasdf    ")
          setMessages(response.data.messages)
        }
      }
      fetchMessages()
   },[currentRoom])
 
  
   console.log(messages)
  return (
    <div className="chat-content">
      <SideBarStud chatRooms={chatRooms} setCurrentRoom={setCurrentRoom} socket={socket}/>    
      <MainMessages messages={messages} id = {studentId} currentRoom={currentRoom}/>
      <InputComponentStudent currentRoomId = {currentRoom?._id} socket={socket} id={studentId}/>
    </div>
)};
    
export default StudentChat;
