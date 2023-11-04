import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import { adminModel } from "../model/adminModel.js";
import {tutorModel} from "../model/tutorModel.js" 
import {studentModel} from "../model/studentModel.js"      
import extractCookie from "../utils/extractCookie.js";
import decodeToken from "../utils/decodeToken.js";
import  bookingModel    from "../model/bookingModel.js"
/**
 * @route   POST /api/login-admin
 * @desc    login the admin 
 * @access  Public
*/
export async function loginAdmin(req, res) {
    let { email, psswd } = req.body;
    try {
        let admin = await adminModel.findOne({ email })
        console.log("🐱‍👤🐱‍👤🐱‍👤",admin)
        if (!admin) {
            return res.send({"err":"Email not registered!"})
        }
        let data = {
            id:admin._id,
            fName:admin.fName,
            lName:admin.lName,
            email:admin.email,
        }
        bcrypt.compare(psswd, admin.psswd, async function (err, result) {
            if (err) res.send(500).send(err)

            if (!result) {
                return res.send({"err":"Password is Wrong Amigos!"})
            }

            //create a jwt token
            let response = await createToken({ id: admin._id, email: admin.email },process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
            console.log("*********",process.env.CLIENT_DOMAIN)  //this was done cuz of caching the server was running the old CLIENT_DOMAIN
            const cookieOptions = {
                httpOnly: true,
                secure:false,
                expires: expiration,
                domain:process.env.CLIENT_DOMAIN,
                path:"/",
            };
            
            res.cookie('tokenA', response, cookieOptions);
            return res.status(200).send({data:data,message:"You have logged in Successfuly"})
          
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }

}
 

/**
 * @route   GET /api/verify-admin
 * @desc    verifies the admin
 * @access  Private
*/
export async function verifyAdmin(req,res){
    // Verify the token (assuming you have a function to do this)
    try {
        const tokenA = extractCookie(req,"tokenA") // Assuming you named your cookie 'tokenA'
        if(tokenA){
            const payload = decodeToken(tokenA,process.env.SECRET_KEY);
            let admin = await adminModel.findOne({_id:payload.id})
            if(admin){
                console.log(admin);
                return res.send({success:"This is a valid user",info:payload})
            }else{
                return res.status(200).send({err:"The Admin Aint valid"})
            }
        }else{
            return res.status(200).send({err:"The Admin Aint valid"})
            
        }
        
        
    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(401); 
    }

}

/**
 * @route   GET /api/admin-tutor-view
 * @desc    queries the Tutors data from the Db
 * @access  Private
*/
export async function adminTutorView(req, res) {
    console.log("Hello this route is targetted")
    try {
        const { search, filterField, filterValue, page, limit, sortField, sortOrder } = req.query;

        const baseQuery = {};

        //⭐⭐⭐⭐⭐⭐⭐⭐⭐ very important search query
        if (search) {
            const searchFields = ['fName', 'lName', 'email', 'address', 'college']; // Add more fields as needed
            baseQuery.$or = searchFields.map(field => ({ [field]: { $regex: new RegExp(search, 'i') } }));
        }
        
        if (filterField && filterValue) {
            baseQuery[filterField] = filterValue;
        }

        const skip = (page - 1) * limit;

        // Create sort object based on query parameters
        const sort = {};
        if (sortField && sortOrder) {
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;
        }

        const tutors = await tutorModel
            .find(baseQuery)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const totalCount = await tutorModel.countDocuments(baseQuery);

        return res.json({
            tutors,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
            limit: Number(limit)
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * @route   GET /api/admin-student-view
 * @desc    queries the Students data from the Db
 * @access  Private
*/
export async function adminStudentView(req, res) {
    console.log("Hello this route is targetted")
    try {
        const { search, filterField, filterValue, page, limit, sortField, sortOrder } = req.query;

        const baseQuery = {};

        //⭐⭐⭐⭐⭐⭐⭐⭐⭐ very important search query
        if (search) {
            const searchFields = ['fName', 'lName', 'email']; // Add more fields as needed
            baseQuery.$or = searchFields.map(field => ({ [field]: { $regex: new RegExp(search, 'i') } }));
        }
        
        if (filterField && filterValue) {
            baseQuery[filterField] = filterValue;
        }

        const skip = (page - 1) * limit;

        // Create sort object based on query parameters
        const sort = {};
        if (sortField && sortOrder) {
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;
        }

        const students = await studentModel
            .find(baseQuery)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit)).select('-psswd');

        const totalCount = await studentModel.countDocuments(baseQuery);
        console.log(students)
        return res.json({
            students,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
            limit: Number(limit)
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


/**
 * @route   GET /api/chart-bookings
 * @desc    queries the Booking data for rendering charts
 * @access  Private
*/
export async function chartBookings(req, res) {
    console.log("Bookings Chart is accessed")
    try {
        const bookings = await bookingModel.find({
          cancelled: false, // Get only non-cancelled bookings
        }).populate('courseId tutorId', 'courseName price tutorName duration'); // Populate with course and tutor details
        console.log("bookings",bookings)
        const responseData = bookings.map(booking => ({
          createdAt: booking.createdAt,
          courseName: booking.courseId.courseName,
          tutorName: booking.tutorId.tutorName,
          price: booking.courseId.price,
          courseDuration: booking.courseId.duration, // Calculate course duration
          // Add other details as needed
        }));
    
        res.json(responseData);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


/**
 * @route   GET /api/tut-stud-count
 * @desc    queries the Booking data for rendering charts
 * @access  Private
*/
export async function tutStudCount(req, res) {
    console.log("Bookings Chart is accessed")
    try {
        let tutorCount = await tutorModel.countDocuments({isBlocked:false})
        let studentCount = await studentModel.countDocuments({isBlocked:false})
        res.status(200).json({tut:tutorCount,stud:studentCount});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

/**
 * @route   GET /api/get-student
 * @desc    queries the specific students data 
 * @access  Private
*/
export async function getStudent(req, res) {
    try {
        let {id} = req.query;
        let student = await studentModel.findOne({_id:id}).select('-psswd');
        res.status(200).json({stud:student});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
/**
 * @route   GET /api/get-student-bookings
 * @desc    queries the specific students booking data 
 * @access  Private
*/
export async function getStudentBookings(req, res) {
    try {
        let {id} = req.query;
        let booking = await bookingModel.find({studentId:id}).populate('courseId tutorId', 'fName lName courseName tutorName price');
        res.status(200).json({booking:booking});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

/**
 * @route   PUT /api/approve-cancellation
 * @desc    This approves the cancellation requested by the student 
 * @access  Private
*/
export async function approveCancellation(req, res) {
    try {
        let {id} = req.body;
        console.log(id)
        let booking = await bookingModel.findOne({_id:id})
        console.log(booking)
        booking.cancellationRequest.approvedByAdmin = true;
        booking.cancellationRequest.cancellationStatus = 'approved';
        let data = await booking.save();
        console.log(data)
        res.status(200).json({success:true});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

/**
 * @route   PUT /api/disapprove-cancellation
 * @desc    This disapproves the cancellation requested by the student 
 * @access  Private
*/
export async function disapproveCancellation(req, res) {
    try {
        let {id} = req.body;
        console.log(id)
        let booking = await bookingModel.findOne({_id:id})
        console.log(booking)
        booking.cancellationRequest.cancellationStatus = 'disapproved';
        let data = await booking.save();
        console.log(data)
        res.status(200).json({success:true});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


