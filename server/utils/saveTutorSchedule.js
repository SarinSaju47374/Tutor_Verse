import mongoose from "mongoose";
let {ObjectId} = mongoose.Types;
import { tutorModel } from "../model/tutorModel.js";


export default async function saveTutorSchedule(tutorId,courseId,slots){
    try{
        let info = await tutorModel.findOne({_id:tutorId})
        // console.log("before",new ObjectId(courseId));  
        // courseId = new ObjectId(courseId)
        console.log("after",courseId);  
        let course = info.schedule.find(data=>new ObjectId(courseId).equals(data.courseId))
        console.log(course)
        if(course){
            slots.map(slot=>{
                course.slots.push(slot)
            })
        }else{
            let data = {
                courseId: new ObjectId(courseId),
                slots
            }
            info.schedule.push(data);
        }
        
        info.save();
    }catch(err){
        throw new Error(err)
    }
}