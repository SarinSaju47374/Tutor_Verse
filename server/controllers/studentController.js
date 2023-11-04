import { studentModel } from "../model/studentModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import tutorSlotModel from "../model/tutorSlotModel.js";
import bookingModel from "../model/bookingModel.js"
import mongoose, { startSession } from "mongoose";
import extractCookie from "../utils/extractCookie.js";
import decodeToken from "../utils/decodeToken.js";
import stripe from "stripe";
import coursePrice from "../utils/coursePrice.js";
import getStartAndEndDate from "../utils/getStartAndEndDate.js";
import checkStudentSlot from "../utils/checkStudentSlot.js";
import chatRoomModel from "../model/chatRoomModel.js";
import getWeekdays  from "../utils/getWeekDays.js";
const stripeInstance = stripe('sk_test_51NzYcqSD2MaFS36ji6B9AT4rtWiYHoLJSK7pm1P6t74VUF024O9P3TX45HOVm7E0GBC85IuxsUd3LsmZnYFHz7pX00Vy34qUQg');
const { ObjectId } = mongoose.Types;

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
            role:"student"
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
                secure: false,
                expires: expiration,
                domain: process.env.CLIENT_DOMAIN,
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
export async function paymentCheckout(req, res) {
    try {
        const {id,email} = req.payload;
        const {price,courseName,tutorId,slot} = req.body;
        let status = await checkStudentSlot(id,slot)
        if(status) return res.status(200).send({err:"You have already booked a course at this Time Slot"})
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types:['card'],
            mode: 'payment',
            line_items:[
            {
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:courseName,
                    },
                    unit_amount:price*100
                },
                quantity:1,
            }
            ],
            customer_email:email,
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/fail`,
        });
        
       
        
        res.status(200).send({url:session.url,sId:session.id})

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
/**
 * @route   GET /api/booking
 * @desc    student Books a SLOT
 * @access  Private
 */
export async function booking(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token 
        let {courseId,tutorId,slot,sid} = req.body;
        const sessionDetails = await stripeInstance.checkout.sessions.retrieve(sid);
        if(sessionDetails.payment_status==='unpaid') return res.status(200).send({success:false})
        let course = await coursePrice(courseId)
        const {start,end} = getStartAndEndDate(course.duration);
        let days = getWeekdays(start,end);
        if(id && courseId && tutorId && Object.keys(slot).length){
            await bookingModel.create({
                courseId:courseId,
                tutorId:tutorId,
                studentId:id,
                slot,
                startDate:start,
                endDate:end,
                classCount:days,
                pricePaid:course.price
            })
            await chatRoomModel.create({
                courseId:courseId,
                tutorId:tutorId,
                studentId:id,
            })
        }
        res.status(200).send({success:true})

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   POST /api/tutor-slot-availability
 * @desc    student Books a SLOT
 * @access  Private
 */
export async function tutorSlotsBooked(req, res) {
    try {
        
        let {tutorId} = req.body;
        let data = await bookingModel.find({tutorId,completed:false}); 
        let slots = data.map(booking=>booking.slot)
        res.status(200).send({slots:slots})

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   POST /api/check-booking
 * @desc    Checks whether the use has booked the tutor with that course or not
 * @access  Private
 */
export async function checkBooking(req, res) {
    try {
        let {id} = req.payload; //student id from the middleware
        if(!id) return res.status(200).send({err:"Invalid Id"})
        let {tutorId,courseId} = req.body;
        let data = await bookingModel.find({courseId,tutorId,studentId:id});
        if(data.length>0){
            res.status(200).send({booked:true});
        }else{
            res.status(200).send({booked:false});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   GET /api/load-chatrooms-student
 * @desc    loads the chat rooms associated to specific students
 * @access  Private
 */
export async function loadChatRoomsStudent(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token 
        if(!id) res.status(400).send({"err":"Invalid user"})
        let rooms = await chatRoomModel.find({studentId:id})
                        .populate({
                            path:'tutorId',
                            select:'fName lName profilePhoto'
                        })
                        .populate({
                            path:'courseId',
                            select:'courseName image board'
                        })
        res.status(200).send(rooms)

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
/**
 * @route   GET /api/load-bookings
 * @desc    loads the bookiing details of specific student 
 * @access  Private
 */
export async function loadBookingList(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token 
        if(!id) res.status(400).send({"err":"Invalid user"})
        let bookings = await bookingModel.find({studentId:id})
                        .sort({ createdAt: -1 })
                        .populate({
                            path:'tutorId',
                            select:'fName lName'
                        })
                        .populate({
                            path:'courseId',
                            select:'courseName board price'
                        })
        res.status(200).send(bookings)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
/**
 * @route   POST /api/cancel-bookings   🤓🤓🤓🤓🤓
 * @desc    requests the cancellation of the Booking
 * @access  Private
 */
export async function cancellationRequest(req, res) {
    try {
        const {id} = req.payload; //Taking Data from the Token 
        const {bid} = req.body;
        if(!id) res.status(400).send({"err":"Invalid user"})
        let booking = await bookingModel.findOne({_id:bid})
        booking.cancellationRequest.requestedByStudent = true;
        await booking.save();
        res.status(200).send({message:"The cancel for the course is requested"})
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

