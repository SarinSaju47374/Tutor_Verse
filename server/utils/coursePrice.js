import {courseModel} from "../model/courseModel.js";

export  default async function coursePrice(id){
    try{
        let course = await courseModel.findOne({_id:id});
        if(course){
            return {
                price:course.price,
                duration:course.duration
            }
        }else{
            throw new Error("The course Id you gave doesn't exist amigo!")
        }
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
}