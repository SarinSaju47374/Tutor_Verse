import { tutorModel } from "../model/tutorModel.js";

export default async function slotAvailability(id,slots){
    try{
        let tutor = await tutorModel.findOne({_id:id});
        let slotArr = [];
        if(tutor.schedule.length>0){
            tutor.schedule.map(data=>{
                data.slots.map(slot=>slotArr.push(slot.label));
            }) 
            slots = slots.map(slot=>slot.label);
            let selectedSlots = slotArr.filter(slot=>slots.includes(slot))
            if(selectedSlots.length<1) return {avail:false} 
            return {avail:true,strng : formatArray(selectedSlots)};
        }else{
            return {avail:false}
        }
    }catch(err){
        throw new Error(err);
    }
    
}

function formatArray(arr) {
    if (arr.length === 0) {
      return '';
    }
  
    if (arr.length === 1) {
      return arr[0].toString();
    }
  
    let result = '';
  
    for (let i = 0; i < arr.length - 1; i++) {
      result += arr[i] + ', ';
    }
  
    result = result.slice(0, -2) + ' and ' + arr[arr.length - 1];
  
    return result;
  }
  