import dotenv from "dotenv";
import schedule from 'node-schedule';
dotenv.config();
import express from "express";
import http from "http";
import morgan from "morgan";
import connect from "./database/conn.js";
import cors from "cors";
import cloudinaryConfig from "./cloudinary/cloudinary.js";
import fs from "fs";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
import bookingModel from "./model/bookingModel.js";
import path from "path"

// import moment from 'mooment'
import axios from "axios";
const io = new Server(server, {
  pingTimeout:60000,
  cors: {
    origin: "*",
  },
});

//⭐⭐⭐
// const task = ()=>{
//   console.log("I am scheduled amigos")
// }
// const job = schedule.scheduleJob('* * * * *', task);
//⭐⭐⭐


const port = process.env.PORT || 8000;

// Routes
import studentRouter from "./router/studentRouter.js";
import tutorRouter from "./router/tutorRouter.js";
import commonRouter from "./router/commonRouter.js";
import courseRouter from "./router/courseRouter.js";
import adminRouter from "./router/adminRouter.js";
// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://192.168.60.127:3001", // Add your local IP here
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// app.use(cors())
app.use(morgan("tiny"));
app.disable("x-powered-by"); //hackers wont know which stack we are using (eg. express)
app.use("/uploads", express.static("uploads"));




//Production

console.log("BUMChika ")
// Api Routes
app.use("/api", studentRouter);
app.use("/api", tutorRouter);
app.use("/api", commonRouter);
app.use("/api", courseRouter);
app.use("/api", adminRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const basePath = path.dirname(__dirname);
  app.use(express.static(path.join(basePath, "client/dist")));

  app.get("*", function (req, res) {
    const indexPath = path.join(basePath, "client/dist/index.html");

    res.sendFile(indexPath, function (err) {
      if (err) {
        console.error("Error sending index.html:", err);
        res.status(500).send(err);
      } else {
        console.log("Index.html send successfully");
      } 
    });  
  });
  
}else{
  console.log("Great")
}
//test
app.get("/api/download", async (req, res) => {
  let fileUrl = req.query.url; // Assuming the URL is sent as a query parameter named "url"
  // fileUrl = decodeURIComponent(fileUrl).replace(/\s/g, '%20').replace(/\//, '//');

  console.log("😎dfafadsadsf", fileUrl);
  try {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const fileName = fileUrl.split("/").pop(); // Extracting the file name from the URL
    const mimeType = response.headers["content-type"];

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send("File not found");
  }
});

const rooms = {};
//socket io
io.on("connection", (socket) => {
  console.log("We are connected!");

  socket.on("joinNotificationRoom", async (userId) => {
    const bookings = await bookingModel.find({studentId:userId}).populate('courseId')
   
    // const bookings = [
    //   {
    //     startDate: "2023-11-01T00:00:00.000+00:00",
    //     endDate: "2023-11-05T00:00:00.000+00:00",
    //     message:"Sloppy amigos",
    //     slot: {
    //       value: "10:40",
    //     },
    //   },
    //   {
    //     startDate: "2023-10-01T00:00:00.000+00:00",
    //     endDate: "2023-11-04T00:00:00.000+00:00",
    //     message:"Bitch Ya!",
    //     slot: {
    //       value: "10:41",
    //     },
    //   },
    //   {
    //     startDate: "2023-11-01T00:00:00.000+00:00",
    //     endDate: "2023-11-02T00:00:00.000+00:00",
    //     message:"Astala Vista Bitches!",
    //     slot: {
    //       value: "10:43",
    //     },
    //   },
    // ];
    socket.join(userId)
    let startDate = new Date("2023-11-01T00:00:00.000+00:00")
    let endDate = new Date("2023-11-05T00:00:00.000+00:00")
    let value = "10:06"
    // scheduleNotification(startDate,endDate,value,io,userId)
    
    bookings.map(ele=>{
      let message = `Your ${ele.courseId.courseName} is scheduled at ${ele.slot.label}`;
      scheduleNotification(ele.startDate,ele.endDate,ele.slot.value,message,io,userId)
    })
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", (roomId, message) => {
    io.to(roomId).emit("message", message);
  });

  socket.on("check", (data) => {
    let { roomID } = data;
    console.log("Bam");
    socket.to(roomID).emit("message", "Received check event");
  });

  socket.on("join room", (roomID) => {
    console.log("join room", roomID);
    // Join the socket to the room
    socket.join(roomID);
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
     
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

  socket.on("disconnect", () => {
    console.log("We are disconnected");
  });

//   socket.on("toggle mic", ({ roomID, mic }) => {
//     console.log("The mic is toggled in backend")
//     socket.to(roomID).emit("toggle mic", { mic });
// });

//   socket.on("toggle video", ({ roomID, vid }) => {
//     console.log("Toggled Amigo!!!!!!")
//     socket.to(roomID).emit("toggle video", { vid });
//   });

  socket.on("end call", ({ roomID,status }) => {
    socket.to(roomID).emit("end call",status);
    window.close();
  });

});

function scheduleNotification(startDate,endDate,slotTime,message,io,userId){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const job = schedule.scheduleJob(`0 ${slotMinute} ${slotHour-1} * * *`, function () {
    const now = new Date(new Date().setUTCHours(0, 0, 0, 0))  ;
  
    if (now >= startDate && now <= endDate && now.getDay() !== 0) { 
      io.to(userId).emit('notification',`${message}`)
      console.log('Sending notification...');
    } else {
        job.cancel();
    }
})}

connect()
  .then(() => {
    try {
      server.listen(port, () => {
        console.log(`The server is running at port number ${port} `);
      });
    } catch (err) {
      console.log("Cannot Connect to the server", err);
    }
  })
  .catch((err) => {
    console.log("Invalid Database Connection !!", err);
  });
