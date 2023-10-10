
// import dotenv from 'dotenv'
// dotenv.config() 
import {v2 as cloudinary} from 'cloudinary'
function cloudinaryConfig(){
    cloudinary.config({  
        cloud_name: process.env.CLOUDINARY_NAME,   
        api_key: process.env.CLOUDINARY_APIKEY, 
        api_secret: process.env.CLOUDINARY_APISECRET 
    });
    return cloudinary;
}



// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

export default cloudinaryConfig;
             