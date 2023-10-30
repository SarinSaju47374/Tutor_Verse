import { useState,useEffect } from 'react'
import {useSelector} from "react-redux"
import "../../scss/screen/Student/StudentChat.scss";
import SideBarTut from '../../components/Chat/SideBarTut';
import MainMessages from '../../components/Chat/MainMessages';

import InputComponentTutor from '../../components/Chat/InputComponentTutor';
import axios from "../../axios"
import {io} from "socket.io-client"
const ENDPOINT = import.meta.env.VITE_SERVER_URL;

const TutorChat = () => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); 
  const [chatRooms,setChatRooms] = useState([]);
  let tutorId = useSelector(state => state.tutor.user?.id);
  let profile = useSelector(state => state.tutor.user?.profile);
  useEffect(() => {
    const newSocket = io(ENDPOINT, { transports: ['websocket'] });
    setSocket(newSocket);

    async function fetchChatRooms() {
      try {
        const response = await axios.get('/load-chatrooms-tutor');
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
      <SideBarTut chatRooms={chatRooms} setCurrentRoom={setCurrentRoom} socket={socket}/>
      <MainMessages messages={messages} id = {tutorId} currentRoom={currentRoom} profile={profile}/>
      <InputComponentTutor currentRoomId = {currentRoom?._id} socket={socket} id={tutorId}/>
    </div> 
)};
    
export default TutorChat;
