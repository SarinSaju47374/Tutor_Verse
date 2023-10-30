import { studentModel } from "../model/studentModel.js";
import { tutorModel } from "../model/tutorModel.js";
import otpModel from "../model/otpModel.js";
import blogModel from "../model/blogModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//utils
import generateOtp from "../utils/generateOtp.js";
import sendMail from "../utils/sendMail.js";
import saveOtpTemp from "../utils/saveOtpTemp.js";



/**
 * @route   POST /api/send-otp
 * @desc    Sends OTP to mentioned mail and Saves it temporarily to the DB for both tutors and students
 * @access  Public
 */
export async function sendOtp(req, res) {

    try {
        const { email } = req.body;
        console.log("🚀 ~ file: controllers.js:85 ~ sendOTP ~ emḁil:", email)
        const otp = generateOtp();
        let message = `Your Otp is ${otp}`
        await sendMail(email, "Your Verification", message);
        await saveOtpTemp(otp, email);
        return res.status(200).send("OTP sent successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

/**
 * @route   POST /api/verify-otp
 * @desc    Both Tutors and Students can verify their otp (OTP schema is general collection that is temporary)
 * @access  Public
 */
export async function verifyOtp(req, res) {
    try {
        let { otp, email } = req.body;
        console.log(req.query)
        const data = await otpModel.findOne({
            email: email,
            otp: otp
        });
        if (data) {
            res.status(200).json({ otpPresent: true })
        } else {
            res.status(200).json({ otpPresent: false })
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * @route   GET /api/reset-session
 * @desc    Deletes the existing Cookie
 * @access  Public
*/
export function reset(req,res){
    const isSecure = req.protocol === 'https';
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(0),
        secure: isSecure, // Set 'Secure' attribute only for HTTPS
        domain:process.env.CLIENT_DOMAIN,
        path:"/"
    };
    
    res.cookie('tokenA', "", cookieOptions);
    res.send("Cookie deleted SIR!")
}

/**
 * @route   POST /api/forgot-psswd
 * @desc    Send the link to the email if the email is present in the DB (for both tutor and student)
 * @access  Public
*/
export async function forgotPsswd(req,res){
     try{
        let {email} = req.body;
        let {user} = req.params;
        if(user=="student"){
            let student = await studentModel.findOne({email});
            if (!student) return res.send({"err":"No such mail registered"})
            let token = jwt.sign({id:student._id,user},process.env.SECRET_KEY_URL,{expiresIn:"500s"});
            let link = `${process.env.CLIENT_URL}/reset-psswd/${student._id}/${token}/${user}`
            let message = `Click this link to reset your Password :- ${link}` 
            await sendMail(email,"Reset Password",message)
            return res.status(200).send("Email sent")
        }else if(user=="tutor"){
            let tutor = await tutorModel.findOne({email});
            if (!tutor) return res.send({"err":"No such mail registered"})
            let token = jwt.sign({id:tutor._id,user},process.env.SECRET_KEY_URL,{expiresIn:"500s"});
            let link = `${process.env.CLIENT_URL}/reset-psswd/${tutor._id}/${token}/${user}`
            let message = `Click this link to reset your Password :- ${link}` 
            await sendMail(email,"Reset Password",message)
            return res.status(200).send("Email sent")
        }else{
            return res.send({"err":"Something went wrong"});
        }
     }catch(err){
        console.log(err);
        return res.send(err);
     }

}

/**
 * @route   POST /api/reset-psswd
 * @desc    verifies the Token and id and then resets the password (for both tutor and student)
 * @access  Public
*/
export async function resetPsswd(req,res){
     try{
        let {tk} = req.params;
        let {psswd} = req.body;
        let {id,user} = jwt.verify(tk,process.env.SECRET_KEY_URL)
        if(user=="student"){
            //  let stdId = jwt.verify(tk,process.env.SECRET_KEY_URL).id;
             if(!id) res.send({"err":true})
             let hashedPsswd = await bcrypt.hash(psswd,10)
             await studentModel.findByIdAndUpdate({_id:id},{psswd:hashedPsswd})
             return res.status(200).send("Successfully Updated!")
        }else{
            // let tutId = jwt.verify(tk,process.env.SECRET_KEY_URL).id;
             if(!id) res.send({"err":true})
             let hashedPsswd = await bcrypt.hash(psswd,10)
             await tutorModel.findByIdAndUpdate({_id:id},{psswd:hashedPsswd})
             return res.status(200).send("Successfully Updated!")
        }
     }catch(err){
        console.log(err);
        return  res.send({"err":true});
     }

}


/**
 * @route   get /api/view-blog
 * @desc    Gets you the blog list
 * @access  Public
*/
export async function viewBlog(req, res) {
    try {
      const { searchQuery, page = 1, perPage = 10,id,bid,nid} = req.query;
      console.log(nid);
      let query;
     if(id){
        query = {author:id}
     }
     else if(bid){
      query = {_id:bid}
     }
     else if(nid){
      query = {_id:{ $ne: nid }}
     }
     else{
        query:{}
     }
      
  
      if (searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { content: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } }
          ]
    ;
      }
      
      const totalBlogs = await blogModel.countDocuments(query);
  
      let blogs = await blogModel
        .find(query)
        .sort({ updatedAt: -1 })
        .populate({
          path: 'author',
          select: 'fName lName profilePhoto',
        })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      blogs = blogs.filter(blog => blog.author !== null);
  
      res.send({
        totalBlogs,
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / perPage),
        blogs
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ err: true });
    }
  }
  
/**
 * @route   get /api/view-spec-blog
 * @desc    View specific blog 
 * @access  Public
*/
export async function viewSpecBlog(req, res) {
    try {
       const {bid} = req.query;
       let data = await blogModel.findOne({_id:bid}).populate(`author`,`fName lName email profilePhoto`)
       if(!data) res.status(400).send("Something went Wrong")
       res.status(200).send(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ err: true });
    }
  }
  