import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from "http"
import morgan from 'morgan';
import connect from './database/conn.js';
import cors from 'cors';
import cloudinaryConfig from "./cloudinary/cloudinary.js"
import {Server} from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*"
    }
})

const port = 3000;

// Routes
import studentRouter from './router/studentRouter.js';
import tutorRouter from './router/tutorRouter.js';
import commonRouter from './router/commonRouter.js';
import courseRouter from './router/courseRouter.js';
// middlewares
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));
app.use(morgan('tiny'))
app.disable('x-powered-by'); //hackers wont know which stack we are using (eg. express)
app.use('/uploads', express.static('uploads'));
// Api Routes
app.use("/api", studentRouter);
app.use("/api", tutorRouter);
app.use("/api", commonRouter);
app.use("/api",courseRouter);

io.on("connection",(socket)=>{
    console.log("We are connected!")

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', (roomId, message) => {
        console.log("Check Amigo!🚚🚚🚚🚚🚚",message)
        io.to(roomId).emit('message', message);
    });

    socket.on("disconnect",()=>{
        console.log("We are disconnected")
    })
})


connect().then(() => {
    try {
        server.listen(port, () => {
            console.log(`The server is running at port number ${port} `)
        })
    } catch (err) {
        console.log("Cannot Connect to the server", err)
    }
}).catch(err => {
    console.log("Invalid Database Connection !!", err)
})

