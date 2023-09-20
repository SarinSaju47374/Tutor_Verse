import { tutorModel } from "../model/tutorModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";



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

