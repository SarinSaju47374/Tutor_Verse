import { tutorModel } from "../model/tutorModel.js";


export default async function checkTutorProfile(id){
    try{
        let tutor = await tutorModel.findOne({_id:id});
        return tutor.profileCompleted;
    }catch(err){
        throw new Error(err);
    }
} 