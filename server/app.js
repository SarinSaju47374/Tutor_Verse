import express from 'express';
import morgan from 'morgan';
import connect from './database/conn.js';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();
const port = 3000;


// Routes
import studentRouter from './router/studentRouter.js';
import tutorRouter from './router/tutorRouter.js';
import commonRouter from './router/commonRouter.js';

// middlewares
dotenv.config();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));
app.use(morgan('tiny'))
app.disable('x-powered-by'); //hackers wont know which stack we are using (eg. express)

// Api Routes
app.use("/api", studentRouter);
app.use("/api", tutorRouter);
app.use("/api", commonRouter);

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`The server is running at port number ${port} `)
        })
    } catch (err) {
        console.log("Cannot Connect to the server", err)
    }
}).catch(err => {
    console.log("Invalid Database Connection !!", err)
})

