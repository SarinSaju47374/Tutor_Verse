import mongoose from  "mongoose";
 
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    otp:{
        type:Number,
        required:true,
        unique:true,
    }
}, {timestamps: true}) 
otpSchema.index({createdAt: 1},{expireAfterSeconds: 110});
// Get the indexes of the 'tokens' collection
const otpModel = mongoose.model("otp",otpSchema);

export default otpModel  