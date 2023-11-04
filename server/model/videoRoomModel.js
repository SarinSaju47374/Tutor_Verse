import mongoose from  "mongoose";
 
const videoRoomSchema = new mongoose.Schema({
    tutorId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
      },
    num:{
        type:Number,
        required:true,
        unique:true,
    }
}, {timestamps: true}) 
videoRoomSchema.index({createdAt: 1},{expireAfterSeconds: 3600});
// Get the indexes of the 'tokens' collection
const videoRoomModel = mongoose.model("vidrand",videoRoomSchema);

export default videoRoomModel  