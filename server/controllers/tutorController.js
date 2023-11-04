import { tutorModel } from "../model/tutorModel.js";
import chatRoomModel from "../model/chatRoomModel.js"
import messageModel from "../model/messageModel.js";
import tutorSlotModel from "../model/tutorSlotModel.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import checkTutorProfile from "../utils/checkTutorProfile.js";
import mongoose from "mongoose";
import saveTutorSchedule from "../utils/saveTutorSchedule.js";
import updateTutorSchedule  from "../utils/updateTutorSchedule.js"
const { ObjectId } = mongoose.Types;
import cloudinaryConfig from "../cloudinary/cloudinary.js"
import extractCookie from "../utils/extractCookie.js";
import decodeToken from "../utils/decodeToken.js";
import slotAvailability from "../utils/slotAvailability.js";
import slotAvailabilityV2 from "../utils/slotAvailabilityV2.js";
import fs from 'fs';
import blogModel from "../model/blogModel.js";
import bookingModel from "../model/bookingModel.js"

/**
 * @route   POST /api/register-tutor
 * @desc    Register a new tutor
 * @access  Public
 */
export async function registerTutorDetails(req, res) {
    try {
        let { fName, lName, email, psswd } = req.body;
        if (psswd) {
            const hashedPsswd = await bcrypt.hash(psswd, 10);

            const tutor = new tutorModel({
                fName,
                lName,
                email,
                // dob: new Date(dob),
                // mob,
                // gender,
                // college,
                // expYear,
                // addr,
                // pinCode,
                psswd: hashedPsswd
            });

            // Return save result as response
            await tutor.save();

            res.status(201).send("You are successfully registered");
        } else {
            return res.status(400).send({
                error: "Password is required"
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            error: "Internal Server Error"
        });
    }
}


/**
 * @route   POST /api/tutor-mail-check
 * @desc    Checks if the tutors mails exists in the collection before registration 
 * @access  Public
 */
export async function tutorMailExists(req, res) {
    try {

        let { email } = req.body;
        console.log(email)
        const existingEmail = await tutorModel.findOne({ email })
        console.log("agaggaaggaag")
        if (existingEmail) {
            console.log(email)
            return res.status(200).json({ isUnique: false })
        } else {
            console.log("asdfa")
            return res.status(200).json({ isUnique: true })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * @route   POST /api/login-tutor
 * @desc    login the tutor 
 * @access  Public
 */
export async function loginTutor(req, res) {
    let { email, psswd } = req.body;
    try {
        let tutor = await tutorModel.findOne({ email })
        if (!tutor) {
            return res.send({"err":"Email not registered!"})
        }else if(tutor.isBlocked){
            return res.send({"err":"You are Blocked!  Contact Admin"})
        }
        let data = {
            id:tutor._id,
            fName:tutor.fName,
            lName:tutor.lName,
            profile:tutor.profilePhoto,
            email:tutor.email,
            schedule:tutor.schedule,
            role:"tutor"
        }
        bcrypt.compare(psswd, tutor.psswd, async function (err, result) {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            if (!result) {
                return res.send({"err":"Password doesnt match"})
            }

            //create a jwt token
            let response = await createToken({ id: tutor._id, email: tutor.email, fName: tutor.fName, lName: tutor.lName },process.env.SECRET_KEY, "24h")
            const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);      
            const cookieOptions = {
                httpOnly: true,
                secure:false,
                expires: expiration,
                domain:process.env.CLIENT_DOMAIN, 
                path:"/",
            };
            
            try {
                res.cookie('tokenA', response, cookieOptions);
                console.log('Cookie set successfully');
              } catch (error) {
                console.error('Error setting cookie:', error);
              }
            console.log(response)
            return res.status(200).send({data:data,message:"You have logged in Successfuly"})
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }

}

/**
 * @route   POST /api/save-slot
 * @desc    save the Slot Selected by the tutor 
 * @access  Private
 */ 
export async function saveSlot(req, res) {
    try {
        let {courseId, slots} = req.body;
        
        let {id} = req.payload;

        // let status = await checkTutorProfile(tutorId)
        let status = true;
        if (!status) {
            return res.status(200).send({"err":"Do complete Your Profile First!"});
        }
        let courseSlots = await tutorSlotModel.findOne({ courseId: courseId });
        
        if(courseSlots){
            let result = await slotAvailability(id,slots)
            console.log("Result is : ",result)
            if(result.avail) return res.status(200).send({"err":`${result.strng} are already selected slots!`});
            let tutorSlots = courseSlots.tutors.find(data => data.tutorId == id);
            if (tutorSlots) {
                slots.forEach(slot => {
                    tutorSlots.slots.push(slot);
                });
            } else {
                let result = slotAvailability(id,slots)
                if(result.avail) return res.status(200).send({"err":`${result.strng} are already selected slots!`});
                courseSlots.tutors.push({ tutorId: id, slots: slots });
            }
            await courseSlots.save();
            await saveTutorSchedule(id,courseId,slots);
        }else{
            let result = await slotAvailability(id,slots)
            console.log("Result is : ",result)
            if(result.avail) return res.status(200).send({"err":`${result.strng} are already selected slots!`});
            await tutorSlotModel.create({
                courseId:new ObjectId(courseId),
                tutors:[
                    {
                        tutorId: new ObjectId(id),
                        slots
                    }
                ]
            })
            await saveTutorSchedule(id,courseId,slots); // adds the slots to the tutor Model too
        }
        
        return res.status(200).send({"success":"Slot(s) saved successfully!"});
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

/**
 * @route   POST /api/update-slot
 * @desc    Update the slots selected by the tutor
 * @access  Private
 */ 
export async function updateSlot(req, res) {
    try {
        const {courseId, slots} = req.body;
        const copySlot = [...slots];
        const {id} = req.payload;
        const courseSlots = await tutorSlotModel.findOne({ courseId: courseId });
        const bookings = await bookingModel.find({tutorId:id})
        const bookedSlots = bookings.map(ele=>ele.slot.label)
        console.log({bookedSlots})
        if(courseSlots){
            let result = await slotAvailabilityV2(id,slots,courseId)
            console.log("Result is : ",result)
            if(result.avail) return res.status(200).send({"err":`${result.strng} are already selected slots!`});
            let tutorSlots = courseSlots.tutors.find(data => data.tutorId == id);
            var slotsNotInCommon = tutorSlots.slots.filter(slotA => !slots.some(slotB => slotA.value === slotB.value));
            var slotConflict = slotsNotInCommon.filter(ele=>bookedSlots.includes(ele.label));     
            slotConflict.forEach(ele=>slots.push({value:ele.value,label:ele.label}))

            if (tutorSlots) {
                tutorSlots.slots = slots;
            } 
            await courseSlots.save();
            await updateTutorSchedule(id,courseId,slots);
        }
        
        if(slotConflict.length==slotsNotInCommon.length){
            return res.status(200).send({error:"Can Edit because the slot is Booked!"});
        }else if(slotConflict.length==0 && slots.length>0){
            return res.status(200).send({success:"Slot(s) saved successfully!"});
        }else{
            return res.status(200).send({success:"Except booked slots other slots are edited!"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

/**
 * @route   DELETE /api/slot-delete
 * @desc    deletes the slot selected by the tutor
 * @access  Private
 */ 
export async function slotDelete(req, res) {
    try {
        let {courseId} = req.query;
        console.log(courseId)
        let {id} = req.payload;
        // let courseSlots = await tutorSlotModel.findOne({ courseId: courseId });
        let bookings = await bookingModel.find({courseId:courseId,tutorId:id});
        if(bookings.length>0){
            return res.status(200).send({"error":"You cant delete this slot. Its already booked by a student"})
        }
        let tutor = await tutorModel.findOne({_id:id});

        await tutorSlotModel.updateOne(
            { courseId: courseId },
            { $pull: { tutors: { tutorId: id } } }
          );
          await tutorModel.updateOne(
            { _id: id },
            { $pull: { schedule: { courseId: courseId } } }
          );
        // let tutorSlot = courseSlots.tutors.filter(data=>!new ObjectId(data.tutorId).equals(id))
        // courseSlots.tutors = tutorSlot;
        // courseSlots.save()
        

    


        return res.status(200).send({"success":"Slot deleted!"});
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

/**
 * @route   Get /api/view-slots
 * @desc    View available slots Selected by the tutor for each subject 
 * @access  Private
 */ 
export async function viewSlots(req, res) {
    try {
  
        let {id} = req.payload;
    
        let data = await tutorModel.findById(id).populate('schedule.courseId');
        res.status(200).send(data.schedule);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

/**
 * @route   GET /api/verify-tutor
 * @desc    verifies the tutor
 * @access  Private
*/
export async function verifyTutor(req,res){
    // Verify the token (assuming you have a function to do this)
    try {
        const tokenA = extractCookie(req,"tokenA") // Assuming you named your cookie 'tokenA'
        if(tokenA){
            const payload = decodeToken(tokenA,process.env.SECRET_KEY);
            let tutor = await tutorModel.findOne({_id:payload.id})
            if(!tutor?.isBlocked){
                console.log(payload)
                return res.send({success:"This is a valid user",info:payload})
            }else{
                return res.status(200).send({err:"The User Aint valid"})
            }
        }else{
            return res.status(200).send({err:"The User Aint valid"})
        }
        
    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(401); 
    }

}

/**
 * @route   GET /api/tutor-details
 * @desc    Provides available data of  the tutor
 * @access  Private
*/
export async function tutorDetails(req,res){
    // Verify the token (assuming you have a function to do this)
    try {
        let {id} = req.payload;
        let tutor = await tutorModel.findOne({_id:id});
        if(!tutor) return res.status(200).send({err:"The tutor doesn't exists!"});
        let data = {
            fName:tutor.fName,
            lName:tutor.lName,
            dob:tutor.dob || "",
            mob:tutor.mob || null,  //CHange it 🗼🗼🗼🗼🗼
            gender:tutor.gender || "",
            college:tutor.college || "",
            expYear:tutor.expYear, 
            addr:tutor.addr || "",
            pinCode:tutor.pinCode || "",
            profilePhoto:tutor.profilePhoto || "https://img.freepik.com/premium-vector/avatars-default-photo-placeholder-multiracial-profile-pictures_116137-1820.jpg"
        }
        res.status(200).send(data)

    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(401); 
    }

}

/**
 * @route   GET /api/tutor-update
 * @desc    Update the Tutor Details
 * @access  Private
*/
export async function tutorUpdate(req,res){
    // Verify the token (assuming you have a function to do this)
    try {
        let {id} = req.payload;
        let {
            fName,
            lName,
            dob,
            mob,
            gender,
            college,
            expYear, 
            addr,
            pinCode,
            profilePhoto,
        } = req.body;
        if(profilePhoto){
            let cloudinary = cloudinaryConfig();
            let uploadedImage = await cloudinary.uploader.upload(profilePhoto, {
                upload_preset: 'verse_uploadTutor',
                public_id: `${fName.toLowerCase()} ${lName.toLowerCase()}-profile-photo`,
                allowed_formats: ['png', 'jpeg', 'jpg'] 
            });

            await tutorModel.findOneAndUpdate({_id:id},{
                fName,
                lName,
                dob,
                mob,
                gender,
                college,
                expYear, 
                addr,
                pinCode:Number(pinCode),
                profilePhoto:uploadedImage.url,
            });
        }else{
            await tutorModel.findOneAndUpdate({_id:id},{
                fName,
                lName,
                dob,
                mob,
                gender,
                college,
                expYear, 
                addr,
                pinCode:Number(pinCode),
            });

        }
        return res.status(200).send(`${fName} Your Profile has Been Updated !`)
    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(200).send({error:"Something went wrong"}); 
    }

}

/**
 * @route   GET /api/tutor-doc-upload
 * @desc    Upload tutor docs to cloudinary and save the link in cloudinary
 * @access  Private
*/
export async function tutorDocUpload(req,res){
    // Verify the token (assuming you have a function to do this)
    try {
        let {id} = req.payload;
        let tutor = await tutorModel.findOne({_id:id});
        let urls = []
         // Upload each file to Cloudinary
         req.files.forEach((file,index) => {
            const oldPath = `uploads/${file.filename}`;
            const newPath = `uploads/${tutor.fName} ${index}.pdf`;
            urls.push(`${process.env.SERVER_URL}/${newPath}`)
            fs.rename(oldPath, newPath, (err) => {
              if (err) throw err;
              console.log(`Renamed ${oldPath} to ${newPath}`);
            });
          });
          tutor.documents = urls
          await tutor.save()
          return res.status(200).send({message:"Successfully Submitted"})
        //  let cloudinary = cloudinaryConfig();
        // const uploadedFiles = await Promise.all(req.files.map(async (file) => {
        //     const result = await cloudinary.uploader.upload(file.path, {
        //         upload_preset: 'verse_uploadTutor',
        //         resource_type: 'raw', // Treat the file as raw content (PDF)
        //         public_id: `${file.originalname.split('.')[0]}_${Date.now()}.pdf`
        //     });
    
        //     return result.url; // URL of the uploaded file in Cloudinary
        // }));
        // console.log(uploadedFiles)
    } catch (error) {
       console.log(error)// Assuming 401 means unauthorized, adjust as needed
       return  res.status(200).send({error:"Something went wrong"}); 
    }

}



/**
 * @route   GET /api/load-chatrooms-tutor
 * @desc    loads the chat rooms associated to specific tutors
 * @access  Private
 */
export async function loadChatRoomsTutor(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token 
        if(!id) res.status(400).send({"err":"Invalid user"})
        let rooms = await chatRoomModel.find({tutorId:id})
                        .populate({
                            path:'studentId',
                            select:'fName lName'
                        })
                        .populate({
                            path:'courseId',
                            select:'courseName image board'
                        })
        
        res.status(200).send(rooms)

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   GET /api/add-blog
 * @desc    saves the blog created by DB 
 * @access  Private
 */
export async function addBlog(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token
        let {title,content,category,imageUrl} = req.body;
        if(!id) res.status(400).send({"err":"Invalid user"})
         let data = await blogModel.create({
            title:title,
            author:id,
            content:content,
            category:category,
            image:imageUrl
        })
        
        res.status(200).send({success:"The Blog Has been Successfully Published"})

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   GET /api/update-blog
 * @desc    updates the blog created by DB 
 * @access  Private
 */
export async function updateBlog(req, res) {
    try {
        let {id} = req.payload; //Taking Data from the Token
        let {title,content,category,imageUrl,bid} = req.body;
        if(!id) res.status(400).send({"err":"Invalid user"})
         let data = await blogModel.updateOne({_id:bid},{
            title:title,
            author:id,
            content:content,
            category:category,
            image:imageUrl
        })
        
        res.status(200).send({success:"The Blog Has been Successfully Published"})

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * @route   DELETE /api/delete-blog
 * @desc    deletes the blog created by tutor 
 * @access  Private
 */
export async function deleteBlog(req, res) {
    try {
        let {bid} = req.query;
        let response = await blogModel.deleteOne({_id:bid})
        if(!response) return res.status(500).send("Something went wrong");
        return res.status(200).send({success:true,mssg:"The Blog is Deleted successfully"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

