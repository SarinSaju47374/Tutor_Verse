import mongoose, { SchemaType } from "mongoose"

const courseSchema = new mongoose.Schema({
     courseName:{
        type:String,
        required:true,
     },
     grade:{
        type:Number,
        required:true,
     },
     board:{
        type:String,
        required:true,
     },
     duration:{
         type:Number,
         required:true,
     },
     desc:{
         type:String,
         required:true,
     },
     tutorsAllotted:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'tutor'
     },
     studentsAllotted:{
      type:[mongoose.Schema.Types.ObjectId],
      ref:'student'
     },
     price:{
        type:Number,
        required:true
     },
     isHidden:{
         type:Boolean,
         default:false,
     },
     image:{
        type:String
     }
})

courseSchema.index({ courseName: 1, grade: 1, board: 1 }, { unique: true });
export const courseModel = mongoose.model("course",courseSchema);