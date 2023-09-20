import otpModel from "../model/otpModel.js";

export default async function saveOtpTemp(otp,email){
    try{
        const filter = { email: email };
        const update = { otp: otp };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const result = await otpModel.findOneAndUpdate(filter, update, options);
  
        if (result) {
        // Document was either found and updated or a new one was created
        return result;
        } else {
        throw new Error("Error saving OTP to database");
        }
        
    }catch(err){
        console.log(err)
        throw new Error("Error saving OTP to database");
    }
}