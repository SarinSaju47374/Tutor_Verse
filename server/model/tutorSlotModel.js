import mongoose from "mongoose"

const tutorSlotSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming subjectId is an ObjectId
    ref: 'course', // Reference to the Subject model
    required: true,
  },
  tutors: [
      {
          tutorId:{
              type: mongoose.Schema.Types.ObjectId, // Assuming tutorId is an ObjectId
              ref: 'tutor', // Reference to the Tutor model
            },
          slots: [{
              value:String,
              label:String
          }],
      }
    ],
});

const tutorSlotModel = mongoose.model('tutorSlot', tutorSlotSchema);

export default tutorSlotModel;
