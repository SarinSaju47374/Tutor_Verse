import mongoose, { SchemaType } from "mongoose"

const bookingSchema = new mongoose.Schema({
     courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course',
        required:true,
     },
     tutorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tutor',
        required:true,
     },
     studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student',
        required:true,
     },
     slot:{
      type:{
         value:String,
         label:String
      }
     },
     cancellationRequest: {
         requestedByStudent: {
            type: Boolean,
            default: false,
         },
         approvedByAdmin: {
            type: Boolean,
            default: false,
         },
         cancellationStatus: {
            type: String,
            default: "pending", // Default status is "pending"
         }
      },
     startDate:{
        type:Date,
        required:true
     },
     endDate:{
        type:Date,
        required:true,
     },
     count:{
        type:Number,
        default:0,
     },
     classCount:{
        type:Number,
        default:0,
     },
     completed:{
      type:Boolean,
      default:false,
     },
     cancelled:{
      type:Boolean,
      default:false,
     },
     pricePaid:{
        type:Number,
     } 
},{
   timestamps:true
})

bookingSchema.index({tutorId: 1, studentId: 1, courseId: 1 }, { unique: true });
const bookingModel = mongoose.model("booking",bookingSchema);
export default bookingModel;