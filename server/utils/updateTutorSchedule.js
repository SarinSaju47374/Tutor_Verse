import mongoose from "mongoose";
let {ObjectId} = mongoose.Types;
import { tutorModel } from "../model/tutorModel.js";


export default async function updateTutorSchedule(tutorId,courseId,slots){
    try{
        let info = await tutorModel.findOne({_id:tutorId})
        
        let course = info.schedule.find(data=>new ObjectId(courseId).equals(data.courseId))
 
        if(course){
            course.slots = slots
        }
        info.save();
    }catch(err){
        throw new Error(err)
    }
}