import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import connect from './database/conn.js';
import cors from 'cors';
import cloudinaryConfig from "./cloudinary/cloudinary.js"
 
const app = express();
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
app.post("/api/test-submit",async (req,res)=>{
    const cloudinary = cloudinaryConfig(); // Initialize cloudinary
    try {
        const { image } = req.body;
        let uploadedImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'verse_upload',
            public_id: `${req.body.courseName}Course`,
            allowed_formats: ['png', 'jpeg', 'jpg']
        });
        console.log(uploadedImage);
        res.status(200).send(uploadedImage);
    } catch (err) {
        console.log('Err: ', err);
        res.status(500).send(err.message);
    }
     
})



// //PRACTICE
// import aws from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3'

// aws.config.update({
//     secretAccessKey:process.env.ACCESS_KEY,
//     accessKeyId:process.env.ACCESS_SECRET,
//     region:process.env.REGION
// })
// const BUCKET = process.env.BUCKET
// const s3 = new aws.S3();
// const upload= multer({
//     storage:multerS3({
//         bucket:BUCKET,
//         s3:s3,
//         acl:"public-read", //Acess control list :- making it publicly available
//         key:(req,file,cb)=>{
//             cb(null,file.originalname)
//         }    
//     })
// })

// app.post("/upload",upload.single("file"),(req,res)=>{
//     console.log(req.file)
//     res.send("Successfully uploaded "+req.file.location+" location")
// })

// app.get("/list",async (req,res)=>{
//     let r = await s3.listObjectsV2({bucket:BUCKET}).promise();
//     let x = r.Contents.map(item=>item.Key)
//     res.send(x)
// })

// app.get("/download/:filename",async(req,res)=>{
//     const filename = req.params.filename;
//     let x = await s3.getObject({bucket:BUCKET,Key:filename}).promise()
//     res.send(x.Body);
// })

// app.get("/delete/:filename",async(req,res)=>{
//     const filename = req.params.filename;
//     let x = await s3.deleteObject({bucket:BUCKET,Key:filename}).promise()
//     res.send("File deleted successfully!");
// })

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

