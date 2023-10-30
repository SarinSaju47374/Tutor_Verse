import mongoose, { SchemaType } from "mongoose"

const blogSchema = new mongoose.Schema({
      title:{
        type:String,
        required:true, 
      },
      author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tutor',
      },
      content:{
        type:String,
        required:true,
      },
      category:{
        type:String,
        required:true,
      },
      image:{
        type:String,
        required:true
      }
},{
    timestamps:true
})

 
const blogModel = mongoose.model("blog",blogSchema);
export default blogModel;