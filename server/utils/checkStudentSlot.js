import bookingModel from "../model/bookingModel.js"
export default async function checkStudentSlot(id,slot){   
    try{
        let data = await bookingModel.find({studentId:id});
     
        if(data){
            data = data.map(item=>getObjectKey(item.slot));
         
            return data.includes(getObjectKey(slot))
        }else{
            return false
        }
    }catch(err){
        throw new Error(err);
    }
}

function getObjectKey(obj) {
    return obj.value + obj.label;
}