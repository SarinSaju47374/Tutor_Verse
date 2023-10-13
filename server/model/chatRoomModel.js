import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    latestmessage: {
      type: String,
      // require: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      require: true,
    },
    courseId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      require: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tutor",
      require: true,
    },
  },
  { timestamps: true }
);

const chatRoomModel = mongoose.model("chatroom", ChatRoomSchema);

export default chatRoomModel;