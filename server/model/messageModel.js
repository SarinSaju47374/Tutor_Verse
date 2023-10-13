import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required:true
      }
    ],
    fileUrl: {
      type: String,
    },
    filetype: {
      type: String,
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;