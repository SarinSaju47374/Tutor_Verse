import React, { useRef, useEffect ,useState } from "react";
import { useParams } from "react-router-dom";
import "../scss/screen/Room.scss";
import { io } from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_SERVER_URL;
import {toast} from "react-toastify"; 
import {useNavigate} from "react-router-dom";

const Room = () => {
    const navigate = useNavigate();
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const { roomID } = useParams();
    const [mic,setMic] = useState(true);
    const [vid,setVid] = useState(true);
    const [endCall,setEndCall] = useState(false);
    const [socket,setSocket] = useState()
    useEffect(() => {
        const newSocket = io(ENDPOINT, { transports: ['websocket'] });
        setSocket(newSocket)
        navigator.mediaDevices?.getUserMedia({ audio: mic, video: vid }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            socketRef.current = newSocket;
            console.log("😪😪",userStream.current.getAudioTracks())
            socketRef.current.emit("join room", roomID);

            socketRef.current.on('other user', userID => {
                console.log("other  user",userID)
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                console.log("user joined", userID)
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);



            // socketRef.current.on('toggle mic', ({ mic }) => {
            //     setMic(mic);
            //     console.log("Rambo churos")
            // });
            
          
              socketRef.current.on('toggle video', ({ vid }) => {
                setVid(vid);
                console.log("ASTALA VISTA AMIGO VAMOS : ",vid)
              });
          
              socketRef.current.on('end call', () => {
                
                setEndCall(true);
              });

              socketRef.current.on('check',(vid,message)=>{
                    console.log(message,vid,"😘")
                })
                
                socketRef.current.on('check', (data) => {
                    const { vid, message, roomID } = data;
                    console.log("Ha Ha");
                    socketRef.current.emit('message', message);
                  });
                  socketRef.current.on('message', (message) => {
                    console.log("targetted");
                    console.log(message, "😘");
                  });
        });
      
        
        return () => {
            if (newSocket) {
              newSocket.disconnect();
              const audioTracks = userStream.current.getAudioTracks();
              audioTracks.forEach(track => track.enabled = false);
              const videoTracks = userStream.current.getVideoTracks();
              videoTracks.forEach(track => track.enabled = false);
              
            }
          };
    }, []);
    const audioTrack = userStream?.current?.getAudioTracks()[0];
    console.log('Audio Track State:', audioTrack?.enabled ? 'Enabled' : 'Disabled');
    console.log("🤣🤣🤣",userStream?.current?.getAudioTracks()[0])

    function test() {
        if (socketRef.current && socketRef.current.connected) {
            console.log("Testing... ")
            console.log("roomID:", roomID);
            // console.log("socket:", socketRef.current);
            socketRef.current.emit("check", { vid: vid, message: "I am called amigo", roomID: roomID });
          }
      }
    // function toggleMic() {
    //     console.log('Toggle Mic');
    //     setMic(prevMic => !prevMic);
    //     const audioTracks = userStream.current?.getAudioTracks();
    //     audioTracks.forEach(track => track.enabled = !mic);
    // }
     
    // function toggleVideo() {
    //     console.log('Toggle Video');
    //     console.log(userStream.current);
    //     if (userStream.current) {
    //         const videoTracks = userStream.current.getVideoTracks();
    //         videoTracks.forEach(track => track.enabled = !vid);
    //     }
    //     setVid(prevVid => !prevVid);
    // }
    function toggleMic() {
        const audioTracks = userStream.current.getAudioTracks();
        console.log(userStream.current.getAudioTracks()[0])
        audioTracks.forEach(track => {
            track.enabled = !track.enabled;
            setMic(track.enabled)
            // peerRef.current.getSenders().forEach(sender => {
            //     if (sender.track.kind === 'audio') {
            //         sender.replaceTrack(track);
            //     }
            // });
            socketRef.current.emit('toggle mic', { mic: track.enabled });
        });
    }
        
      
      function toggleVideo() {
        const videoTracks = userStream.current.getVideoTracks();
        console.log(userStream.current.getVideoTracks()[0])
        videoTracks.forEach(track => {
            track.enabled = !track.enabled
            // peerRef.current.getSenders().forEach(sender => {
            //     if (sender.track.kind === 'video') {
            //         sender.replaceTrack(track);
            //     }
            // });
        });
        setVid(prevVid => !prevVid);
        // Notify partner of video state change
        !vid ? toast.success("Camera is switched on") : toast.success("Camera is switched off");
        socketRef.current.emit('toggle video', {vid: !vid });
      }
    
      function endCallHandler() {
        setEndCall(true);
        // Notify partner of call end
        socketRef.current.emit('end call', { roomID });
        // Redirect to chat page
        navigate('/tutor/chat'); // Make sure to import 'useHistory' from 'react-router-dom'
    }
    
     
    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        console.log("negotiation", userID)
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        console.log("recieve Call", incoming)
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        console.log("answer", message)
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        console.log("candidate", e.candidate)
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        console.log("ice-candidate", incoming)
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        console.log("trackEvent", e.streams[0])
        partnerVideo.current.srcObject = e.streams[0];
    }

    function handleVideoClick(videoNumber) {
        const videoElement = document.querySelector(`.video${videoNumber}`);

        // Toggle the "enlarged" class on the clicked video element
        videoElement.classList.toggle('enlarged');

        // Find the other video element and remove the "enlarged" class
        const otherVideoNumber = videoNumber === 1 ? 2 : 1;
        const otherVideoElement = document.querySelector(`.video${otherVideoNumber}`);
        otherVideoElement.classList.remove('enlarged');
    }

    
    return (
        <div className="video-content">
            <div className="nav">
                <img src="/public/images/Website White Icon.png" alt="" />
                VIDEO CHAT CONFERENCE
            </div>
            <div className="videoCall">
                <div className="video1 enlarged" onClick={() => handleVideoClick(1)}>
                    <video autoPlay ref={userVideo} />
                </div>
                <div className="video2" onClick={() => handleVideoClick(2)}>
                    <video autoPlay ref={partnerVideo} />
                </div>
            </div>
            <div className="video-actions">
                <div className="icon" onClick={toggleVideo}>
                    {userStream?.current?.getVideoTracks()[0]?.enabled ? <i className="fa-solid fa-video-slash"></i> : <i className="fa-solid fa-video"></i>}
                </div>
                <div className="icon" onClick={toggleMic}>
                    {userStream?.current?.getAudioTracks()[0]?.enabled ? <i className="fa-solid fa-microphone"></i> : <i className="fa-solid fa-microphone-slash"></i>}
                </div>
                <div className="icon" onClick={endCallHandler}>
                    <i className="fa-solid fa-phone-slash"></i>
                </div>
                <div className="icon" onClick={test}>
                    <i className="fa-solid fa-bolt"></i>
                </div>
            </div>
            
        </div>
    );
};

export default Room;