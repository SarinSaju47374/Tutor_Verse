import extractCookie  from "../utils/extractCookie.js"
import decodeToken from "../utils/decodeToken.js";

export const tutorAuth = (req,res,next)=>{
    try{
        const token = extractCookie(req,"tokenA");
        const payload = decodeToken(token,process.env.SECRET_KEY);
         
        if(payload.id){
            req.payload = payload;
            next();
        }else{
            res.status(403).json({ error: "Unauthorized access" });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}