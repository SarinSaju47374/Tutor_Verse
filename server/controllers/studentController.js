import { studentModel } from "../model/studentModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";



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


