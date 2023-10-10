import { studentModel } from "../model/studentModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import tutorSlotModel from "../model/tutorSlotModel.js";
import mongoose from "mongoose";
import extractCookie from "../utils/extractCookie.js";
import decodeToken from "../utils/decodeToken.js";
// import uuid from "uuid"
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_SECRET);


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
                // gName,
                // relation,
                email,
                // dob: new Date(dob),
                mob,
                gender,
                // school,
                // board,
                // medium,
                // addr,
                // pinCode,
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
 * @route   POST /api/login-student
 * @desc    login the student 
 * @access  Public
 */
export async function loginStudent(req, res) {

    let { email, psswd } = req.body;
    try {
        let student = await studentModel.findOne({ email })
        if (!student) {
            return res.send({ "err": "This Email is not registerd! Consider Registering!" })
        } else if (student.isBlocked) {
            return res.send({ "err": "You are Blocked!  Contact Admin" })
        }
        let data = {
            id: student._id,
            fName: student.fName,
            lName: student.lName,
            email: student.email,
        }
        bcrypt.compare(psswd, student.psswd, async function (err, result) {
            if (err) res.send(500).send(err)

            if (!result) {
                return res.send({ "err": "Password doesnt match" })
            }

            //create a jwt token
            let response = await createToken({ id: student._id, fname: student.fName, lName: student.lName, email: student.email, }, process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);


            const cookieOptions = {
                httpOnly: true,
                secure: true,
                expires: expiration,
                domain: 'localhost',
                path: "/",
            };

            res.cookie('tokenA', response, cookieOptions);
            return res.status(200).send({ data: data, message: "You have logged in Successfuly" })
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }

}
/**
 * @route   GET /api/verify-student
 * @desc    Verifies the student 
 * @access  Public
 */
export async function verifyStudent(req, res) {

    try {
        let token = extractCookie(req, "tokenA");
        if (!token) return res.status(200).send({ err: "Not A valid user" })
        let payload = decodeToken(token, process.env.SECRET_KEY);
        let tutor = await studentModel.findOne({ _id: payload.id });
        if (!tutor) return res.status(200).send({ err: "Not A valid user" })
        return res.status(200).send({ success: "Valid User" })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: "Not A valid user" })
    }

}

/**
 * @route   GET /api/verify-studentV2
 * @desc    Verifies the student 
 * @access  Public
 */
export async function verifyStudentV2(req, res) {
    try {
        const tokenA = extractCookie(req, "tokenA") // Assuming you named your cookie 'tokenA'
        if (tokenA) {
            const payload = decodeToken(tokenA, process.env.SECRET_KEY);
            let student = await studentModel.findOne({ _id: payload.id })
            if (!student?.isBlocked) {
                console.log(payload)
                return res.send({ success: "This is a valid user", info: payload })
            } else {
                return res.status(200).send({ err: "The User Aint valid" })
            }
        } else {
            return res.status(200).send({ err: "The User Aint valid" })
        }

    } catch (error) {
        console.log(error)// Assuming 401 means unauthorized, adjust as needed
        return res.status(401);
    }
}


/**
 * @route   GET /api/view-tutors
 * @desc    view tutors list
 * @access  Public
 */
export async function viewTutors(req, res) {
    try {
        const { courseId } = req.query;



        const tutors = await tutorSlotModel
            .find({ courseId })
            .populate({
                path: 'tutors.tutorId',
                select: 'fName lName slots expYear profilePhoto',
            })
            .populate({
                path: 'courseId',
                select: 'courseName duration board',
            })

        res.status(200).json(tutors);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
/**
 * @route   GET /api/view-tutor-det
 * @desc    view specific tutor details with slots associated to that course 
 * @access  Public
 */
export async function viewTutorDet(req, res) {
    try {
        const { courseId, tutorId } = req.query;
        console.log(req.query)
        const tutorSlot = await tutorSlotModel.findOne({
            courseId
        })
            .populate({
                path: 'tutors.tutorId',
                select: 'fName lName slots expYear profilePhoto',
            })
            .populate({
                path: 'courseId',
                select: 'courseName duration board price',
            });

        let inf = tutorSlot.tutors.filter(data => new mongoose.Types.ObjectId(data.tutorId._id).equals(tutorId));
      
        let data = {
            course:tutorSlot.courseId,
            tutor:inf[0].tutorId,
            slots:inf[0].slots
        }
       
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
 * @route   GET /api/payment
 * @desc    view specific tutor details with slots associated to that course 
 * @access  Public
 */
// export async function payment(req, res) {
//     try {
//         const {id,email} = req.payload;
//         const {data} = req.body;
//         const idempontencyKey = uuid();
//         return stripeInstance.customers.create({
//             email:email,
//             source:id,
//         }).then(customer=>{
//             stripe.charges.create({
//                 amount: data.price *100,
//                 currency: "inr",
//                 customer: customer.id,
//                 receipt_email:"sanjuag99@gmail.com",
//                 desc:data.name,
//                 shipping:{
//                     name:"asdflk",
//                     address:{
//                         country:"hjocd"
//                     }
//                 }
//             },{idempontencyKey})
//         }).then(result=>res.status(200).json(result))
//         .catch(err=>console.log(err))

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

