import jwt from "jsonwebtoken";

export default async function createToken(payload,secret,time){
    try{
        let token= jwt.sign(payload,secret,{expiresIn:`${time}`})

        return token
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
} 