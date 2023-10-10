import{courseModel} from "../model/courseModel.js"
import cloudinaryConfig from "../cloudinary/cloudinary.js"

/**
 * @route   POST /api/course-add
 * @desc    Adds course to the database and uploads the image to Cloudinary
 * @access  Public
*/
export async function courseAdd(req,res){
     try{
          let {courseName,rate,grade,board,desc,price,duration,image} = req.body;
          courseName = courseName.toUpperCase();

          let cloudinary = cloudinaryConfig();

          let courseExist = await courseModel.findOne({courseName,board,grade})
          if(courseExist) return res.status(200).send({"error":"This Course already Exists in the Database."})

          let uploadedImage = await cloudinary.uploader.upload(image, {
               upload_preset: 'verse_upload',
               public_id: `${courseName.toLowerCase()}-${grade}-${board}Course`,
               allowed_formats: ['png', 'jpeg', 'jpg'] 
          });

         
          await courseModel.create({
               courseName,
               rate,
               grade,
               board,
               desc,
               price:Number(price),
               duration:Number(duration),
               image:uploadedImage.url
          })
          return res.status(200).send("Saved in the Database")
     }catch(err){
          console.log(err)
          return res.status(200).send({"error":"Something went Wrong"})
     }
}

// /**
//  * @route   GET /api/course-view
//  * @desc    Sends the whole list of courses
//  * @access  Public
// */
// export async function courseView(req,res){
//      try{
//            let courses = await courseModel.find();
//            res.status(200).json(courses)
//      }catch(err){
//           console.log(err)
//           return res.status(200).send({"error":"Something went Wrong"})
//      }
// }


/**
 * @route   POST /api/course-update
 * @desc    Adds course to the database and uploads the image to Cloudinary
 * @access  Public
*/
export async function courseUpdate(req,res){
  try{
       let {id,courseName,rate,grade,board,desc,price,duration,image} = req.body;
       courseName = courseName.toUpperCase();

       let cloudinary = cloudinaryConfig();

       let courseExist = await courseModel.findOne({courseName,board,grade})
       if(courseExist) return res.status(200).send({"error":"This Course already Exists in the Database."})

       let uploadedImage = await cloudinary.uploader.upload(image, {
            upload_preset: 'verse_upload',
            public_id: `${courseName.toLowerCase()}-${grade}-${board}Course`,
            allowed_formats: ['png', 'jpeg', 'jpg'] 
       });

      
       await courseModel.findOneAndUpdate({_id:id},{
            courseName:courseName,
            price: price,
            grade: grade,
            board: board,
            desc: desc,
            image: uploadedImage.url,
            duration: duration,
       })
       return res.status(200).send("Saved in the Database")
  }catch(err){
       console.log(err)
       return res.status(200).send({"error":"Something went Wrong"})
  }
}

/**
 * @route   GET /api/course-view
 * @desc    Get a list of courses with search, pagination, and filtering options
 * @access  Public
 */
export async function courseView(req, res) {
     try {
       const {
         search,  // Search term
         page = 1, // Page number (default to 1)
         limit = 10, // Number of items per page (default to 10)
         board, // Board filter
         grade // Grade filter
       } = req.query;
   
       let query = {};
   
       if (search) {
         query.$or = [
           { courseName: new RegExp(search, 'i') },
           { desc: new RegExp(search, 'i') }
         ];
       }
   
       if (board) {
         query.board = board;
       }
   
       if (grade) {
         query.grade = grade;
       }
   
       const courses = await courseModel
         .find(query)
         .skip((page - 1) * limit)
         .limit(Number(limit));
   
       const totalCourses = await courseModel.countDocuments(query);
   
       res.status(200).json({
         courses,
         totalCourses,
         totalPages: Math.ceil(totalCourses / limit),
         currentPage: Number(page)
       });
     } catch (err) {
       console.log(err);
       return res.status(500).send({ error: "Something went wrong" });
     }
}
   
/**
 * @route   PATCH /api/course-hide
 * @desc    Get a list of courses with search, pagination, and filtering options
 * @access  Public
 */
export async function courseHide(req, res) {
  try{
    let {id} = req.body;
    let courseExist = await courseModel.findOne({_id: id});
    if (courseExist) {
      let updatedIsHidden = !courseExist.isHidden;``
      let data = await courseModel.findOneAndUpdate(
        { _id: id },
        { $set: { isHidden: updatedIsHidden } }
      );
      console.log(data)
      return res.status(200).send({"success":true})
    }
    return res.status(200).send("Saved in the Database")
}catch(err){
    console.log(err)
    return res.status(200).send({"error":"Something went Wrong"})
}
}


/**
 * @route   GET /api/course-desc
 * @desc    Get a detail of the course
 * @access  Public
 */
export async function courseDesc(req, res) {
  try{
    let {id} = req.query;
    let data = await courseModel.findById({_id:id});
    res.status(200).send(data);
}catch(err){
    console.log(err)
    return res.status(200).send({"error":"Something went Wrong"})
} 
}
   