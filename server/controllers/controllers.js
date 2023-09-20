import { studentModel } from "../model/studentModel.js";
import { tutorModel } from "../model/tutorModel.js";
import otpModel from "../model/otpModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import jwt from "jsonwebtoken";
//utils
import generateOtp from "../utils/generateOtp.js";
import sendMail from "../utils/sendMail.js";
import saveOtpTemp from "../utils/saveOtpTemp.js";
import { adminModel } from "../model/adminModel.js";
import cookieExtraction from "../utils/cookieExtractor.js";
import cookieExtractor from "../utils/cookieExtractor.js";


/**
 * @route   POST /api/register-student
 * @desc    Register a new student
 * @access  Public
 */
export async function registerStudentDetails(req, res) {
    try {
        let { fName, lName, gName, relation, email, dob, mob, gender, school, board, medium, addr, pinCode, psswd } = req.body;
        if (psswd) {
            const hashedPsswd = await bcrypt.hash(psswd, 10);

            const student = new studentModel({
                fName,
                lName,
                gName,
                relation,
                email,
                dob: new Date(dob),
                mob,
                gender,
                school,
                board,
                medium,
                addr,
                pinCode,
                psswd: hashedPsswd
            });

            // Return save result as response
            await student.save();

            res.status(201).send("Heyy!! you are successfully registered");
        } else {
            return res.status(400).send({
                error: "Password is required"
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
}

/**
 * @route   POST /api/register-tutor
 * @desc    Register a new tutor
 * @access  Public
 */
export async function registerTutorDetails(req, res) {
    try {
        let { fName, lName, email, dob, mob, gender, college, expYear, addr, pinCode, psswd } = req.body;
        if (psswd) {
            const hashedPsswd = await bcrypt.hash(psswd, 10);

            const tutor = new tutorModel({
                fName,
                lName,
                email,
                dob: new Date(dob),
                mob,
                gender,
                college,
                expYear,
                addr,
                pinCode,
                psswd: hashedPsswd
            });

            // Return save result as response
            await tutor.save();

            res.status(201).send("You are successfully registered");
        } else {
            return res.status(400).send({
                error: "Password is required"
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
}


/**
 * @route   POST /api/student-mail-check
 * @desc    Checks if the students mails exists in the collection before registration 
 * @access  Public
 */
//
export async function studentMailExists(req, res) {
    try {

        let { email } = req.body;

        const existingEmail = await studentModel.findOne({ email })

        if (existingEmail) {

            return res.status(200).json({ isUnique: false })
        } else {

            return res.status(200).json({ isUnique: true })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


/**
 * @route   POST /api/tutor-mail-check
 * @desc    Checks if the tutors mails exists in the collection before registration 
 * @access  Public
 */
export async function tutorMailExists(req, res) {
    try {

        let { email } = req.body;
        console.log(email)
        const existingEmail = await tutorModel.findOne({ email })
        console.log("agaggaaggaag")
        if (existingEmail) {
            console.log(email)
            return res.status(200).json({ isUnique: false })
        } else {
            console.log("asdfa")
            return res.status(200).json({ isUnique: true })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

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
 * @route   POST /api/login-student
 * @desc    login the student 
 * @access  Public
 */
export async function loginStudent(req, res) {

    let { email, psswd } = req.body;
    try {
        let student = await studentModel.findOne({ email })
        if (!student) {
            return res.send({"err":"This Email is not registerd! Consider Registering!"})
        }else if(student.isBlocked){
            return res.send({"err":"You are Blocked!  Contact Admin"})
        }
        bcrypt.compare(psswd, student.psswd, async function (err, result) {
            if (err) res.send(500).send(err)

            if (!result) {
                return res.send({"err":"Password doesnt match"})
            }

            //create a jwt token
            let response = await createToken({ studentId: student._id, email: student.email }, process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
      
            const cookieOptions = {
                httpOnly: true,
                secure:true,
                expires: expiration,
                domain:'localhost',
                path:"/",
            };
            
            res.cookie('tokenA', response, cookieOptions);
            return res.status(200).send(
                 "You have logged in successfully",
            )
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }

}
/**
 * @route   POST /api/login-tutor
 * @desc    login the tutor 
 * @access  Public
 */
export async function loginTutor(req, res) {
    let { email, psswd } = req.body;
    try {
        let tutor = await tutorModel.findOne({ email })
        if (!tutor) {
            return res.send({"err":"Email not registered!"})
        }else if(tutor.isBlocked){
            return res.send({"err":"You are Blocked!  Contact Admin"})
        }
        bcrypt.compare(psswd, tutor.psswd, async function (err, result) {
            if (err) res.send(500).send(err)

            if (!result) {
                return res.send({"err":"Password doesnt match"})
            }

            //create a jwt token
            let response = await createToken({ tutorId: tutor._id, email: tutor.email },process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
      
            const cookieOptions = {
                httpOnly: true,
                secure:true,
                expires: expiration,
                domain:'localhost',
                path:"/",
            };
            
            res.cookie('tokenA', response, cookieOptions);
            return res.status(200).send(
                 "You have logged in successfully",
            )
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }

}
/**
 * @route   POST /api/login-admin
 * @desc    login the admin 
 * @access  Public
 */
export async function loginAdmin(req, res) {
    let { email, psswd } = req.body;
    try {
        let admin = await adminModel.findOne({ email })
        if (!admin) {
            return res.send({"err":"Email not registered!"})
        }
        bcrypt.compare(psswd, admin.psswd, async function (err, result) {
            if (err) res.send(500).send(err)

            if (!result) {
                return res.send({"err":"Password is Wrong Amigos!"})
            }

            //create a jwt token
            let response = await createToken({ adminId: admin._id, email: admin.email },process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
      
            const cookieOptions = {
                httpOnly: true,
                secure:true,
                expires: expiration,
                domain:'localhost',
                path:"/",
            };
            
            res.cookie('tokenA', response, cookieOptions);
            return res.status(200).send(
                 "You have logged in successfully",
            )
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
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
        domain:'localhost',
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
            let token = jwt.sign({id:student._id},process.env.SECRET_KEY_URL,{expiresIn:"500s"});
            let link = `${process.env.BASE_URL}/reset-psswd/${student._id}/${token}/student`
            let message = `Click this link to reset your Password :- ${link}` 
            await sendMail(email,"Reset Password",message)
            return res.status(200).send("Email sent")
        }else if(user=="tutor"){
            let tutor = await tutorModel.findOne({email});
            if (!tutor) return res.send({"err":"No such mail registered"})
            let token = jwt.sign({id:tutor._id},process.env.SECRET_KEY_URL,{expiresIn:"500s"});
            let link = `${process.env.BASE_URL}/reset-psswd/${tutor._id}/${token}/tutor`
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
        let {id,tk,user} = req.params;
        let {psswd} = req.body;
        if(user=="student"){
             let stdId = jwt.verify(tk,process.env.SECRET_KEY_URL).id;
             if((id!=stdId) || !stdId) res.send({"err":true})
             let hashedPsswd = await bcrypt.hash(psswd,10)
             await studentModel.findByIdAndUpdate({_id:stdId},{psswd:hashedPsswd})
             return res.status(200).send("Successfully Updated!")
        }else{
            let tutId = jwt.verify(tk,process.env.SECRET_KEY_URL).id;
             if(!tutId) res.send({"err":true})
             let hashedPsswd = await bcrypt.hash(psswd,10)
             await tutorModel.findByIdAndUpdate({_id:tutId},{psswd:hashedPsswd})
             return res.status(200).send("Successfully Updated!")
        }
     }catch(err){
        console.log(err);
        return  res.send({"err":true});
     }

}


 