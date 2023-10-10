import jwt from "jsonwebtoken";

export default function decodeToken(token,secret){
    try{
        if(token){
            let payload = jwt.verify(token,secret)
            return payload;
        }
    }catch(err){
        throw new Error(err)
    }
}