import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import { adminModel } from "../model/adminModel.js";
        

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
            let tutor = await adminModel.findOne({_id:payload.tutorId})
            if(tutor){
                return res.send({success:"This is a valid user"})
            }else{
                return res.status(200).send({err:"The User Aint valid"})
            }
        }else{
            return res.status(200).send({err:"The User Aint valid"})
        }
        
    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(401); 
    }

}
