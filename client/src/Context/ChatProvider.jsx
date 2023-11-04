import { createContext,useContext,useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({children})=>{
    const [notifications,setNotifications] = useState();
    return (
        <ChatContext.Provider value={{notifications,setNotifications}}>
            {children}
        </ChatContext.Provider>
    )
}
export const ChatState =()=>{
    return useContext(ChatContext);
}
export default ChatProvider;