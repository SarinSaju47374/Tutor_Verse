import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import "../../scss/screen/Tutor/TutorProfile.scss"
import { useSelector } from 'react-redux';
import {useFormik} from 'formik' 
import axios from "../../axios";
import { profileUpdationSchema, tutorSlotSchema } from '../../schemas';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import TutorCourseList from '../../components/Tutor/TutorCourseList';
import {ToastContainer,toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
import TutorSlotSelector from '../../components/Tutor/TutorSlotSelector';


const options = [
  { value: '9:00', label: '9am' },
  { value: '10:00', label: '10am' },
  { value: '11:00', label: '11am' },
  { value: '12:00', label: '12pm' },
  { value: '13:00', label: '1pm' },
  { value: '14:00', label: '2pm' },
  { value: '15:00', label: '3pm' },
  { value: '16:00', label: '4pm' },
  { value: '17:00', label: '5pm' },
  { value: '18:00', label: '6pm' },
  { value: '19:00', label: '7pm' },
  { value: '20:00', label: '8pm' },
  { value: '21:00', label: '9pm' },
]


function TutorProfile({loggedIn}) {
  
  let pdfDis = useRef();
  let pdfHolder = useRef();
  let userId = useSelector(state=>state.tutor.user?.id || "")
  const [data,setData] = useState();
  let courseId;
  const [submitting,setSubmitting] = useState(false)
  let [openPdfForm, setOpenPdfForm] = useState(false)
  let [openProfileForm, setOpenProfileForm] = useState(false)
  let [openSlotForm, setOpenSlotForm] = useState(false)
  let [openSlotSelect, setOpenSlotSelect] = useState(false)
  let [openSlotUpdate, setOpenSlotUpdate] = useState(false)

  const [image,setImage] = useState("");
  const [modified,setModified] = useState(false);
  const [slots,setSlots] = useState([])
  let [mssg, setMssg] = useState("No Files Selected")

  const handlePdfCount = (event) => {

    let fileCount = event.target.files.length;
    console.log(event.target.files)
    setMssg(`${fileCount} ${fileCount === 1 ? 'file' : 'files'} selected`);

  }

  const handleSubmitPdf = async (event) => {
    event.preventDefault();
    setSubmitting(!submitting)
    // Get the selected files from the input element
    const selectedFiles = document.getElementById('pdfFiles').files;
    // Create a FormData object to send files
    const formData = new FormData();
  
    // Append each selected file to the FormData object
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`pdfs`, selectedFiles[i]);
    }
    console.log(Array.from(formData.entries()));
    try {
      const response = await axios.post('/tutor-doc-upload', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.data.error){
        toast.error(response.data.error)
        setSubmitting(false)
      }else{
        toast.success(response.data.message)
        setOpenPdfForm(!openPdfForm);
        setSubmitting(false);
      }
  
      // Handle success (e.g., show a success message)
      console.log('Files uploaded successfully:', response.data);
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading files:', error);
    }
  };
  
  const initialValues1 = {
      fName:"",
      lName:"",
      email: "",
      dob: "",
      mob: "",
      gender: "Male",
      college: "",
      expYear: "",
      addr: "",
      pinCode: "",
      profilePhoto:"https://img.freepik.com/premium-vector/avatars-default-photo-placeholder-multiracial-profile-pictures_116137-1820.jpg",
  }
  // const initialValues1 = {
  //     fName: data.fName,
  //     lName:data.lName,
  //     email: data.email,
  //     dob: data.dob,
  //     mob: data.mob,
  //     gender: data.gender || "Male",
  //     college: data.college,
  //     expYear: data.expYear,
  //     addr: data.addr,
  //     pinCode: data.pinCode,
  // }
  const initialValues2 = {
      courseId:courseId,
      selectedSlots:[]
  }

  const initialValues3 = {
      courseId:"",
      selectedSlots:[]
  }
 
  useEffect(()=>{
    console.log("Asdfa")
     courseId = localStorage.getItem("courseTempId");
     formik2.setValues({
      ...formik2.values,
      courseId
     })
  },[openSlotSelect])

  useEffect(()=>{
    async function run(){
      try{
        let response = await axios.get("/view-slots")
        let info = await axios.get("/tutor-details")
        setData({
          fName: info.data.fName,
          lName:info.data.lName,
          email: info.data.email,
          dob: info.data.dob,
          mob: info.data.mob,
          gender: info.data.gender,
          college: info.data.college,
          expYear: info.data.expYear,
          addr: info.data.addr,
          pinCode: info.data.pinCode,
          profilePhoto:info.data.profilePhoto || "https://img.freepik.com/premium-vector/avatars-default-photo-placeholder-multiracial-profile-pictures_116137-1820.jpg"
        })
        setSlots(response.data);
      }catch(err){
        console.log(err);
      }
    }
    run();
  },[modified])


  const handleFileChange = (event) => {
    formik1.handleChange(event);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Perform any necessary actions with the selected file
      // For example, you can display a preview of the image
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e) => {
        const preview = document.getElementsByClassName('profile-img')[0];
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      setImage(reader)
    }
     
  };

  const handleSlotUpdate = (slot)=>{
    let sl = [];
    slot.slots.map(slot=>{
      sl.push({value:slot.value,label:slot.label})
    })
    formik3.setValues({
      courseId:slot.courseId._id,
      selectedSlots:sl,
    })
    setOpenSlotUpdate(true);
  }

  const handleSlotDelete = async(courseId)=>{
    console.log(courseId)
    let response= await axios.delete("/slot-delete",{
      params:{
        courseId:courseId
      }
    })
    if(response.data.error){
      toast.error(response.data.error)
    }else{
      toast.success(response.data.success);
      setModified(!modified);
    }
  }
  const formik1 = useFormik({
    initialValues: initialValues1,
    validationSchema: profileUpdationSchema ,
    onSubmit: async (values) => {
    let response = await axios.post("/tutor-update",{
      ...values,profilePhoto:image.result
    }) 
    if(response.data.error){
      toast.error(response.data.error);
 
    }else{
      toast.success(response.data)
      setModified(!modified)
    }
    //    return
    }
  })

  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: tutorSlotSchema,
    onSubmit: async (values,actions) => {
        
       let response = await axios.post("/save-slot",{
        courseId : values.courseId,
        slots: values.selectedSlots
       })
       if(response.data.success){
          toast.success(response.data.success) 
          setOpenSlotSelect(false);
          setModified(!modified)
          
       }else{
          toast.error(response.data.err)
          setOpenSlotSelect(false);
          setModified(!modified)
       }
       actions.resetForm()
    }
 });

  const formik3 = useFormik({
    initialValues: initialValues3,
    validationSchema: tutorSlotSchema,
    onSubmit: async (values,actions) => {
        
       let response = await axios.post("/update-slot",{
        courseId : values.courseId,
        slots: values.selectedSlots
       })
       if(response.data.success){
          toast.success(response.data.success) 
          setOpenSlotUpdate(false);
          setModified(!modified)
          
       }else if(response.data.error){
          toast.error(response.data.error)
          setOpenSlotUpdate(false);
          setModified(!modified)
       }
       actions.resetForm()
    }
 });
const handleProfileForm = () => {
  formik1.setValues({
    fName: data.fName,
    lName:data.lName,
    email: data.email,
    dob: data.dob,
    mob: data.mob || "",
    gender: data.gender || "Male",
    college: data.college,
    expYear: data.expYear,
    addr: data.addr,
    pinCode: data.pinCode,
    profilePhoto:data.profilePhoto,
  })
  
  setOpenProfileForm(!openProfileForm)
}
  
  // useEffect(() => {
  //   document.getElementById('pdfFiles').addEventListener('change', function() {
  //     const fileCount = this.files.length;
  //     const fileCountElement = document.getElementById('file-count');
  //     fileCountElement.textContent = `${fileCount} ${fileCount === 1 ? 'file' : 'files'} selected`;
  //   });
  // }, []);
 
  return (
    <>
  
      {
        openPdfForm &&
        <div className="pdf-form">
          <form action="/upload" onSubmit={handleSubmitPdf} encType="multipart/form-data">
          <i className="fa-solid fa-xmark" onClick={() => setOpenPdfForm(!openPdfForm)}></i>
            {
              !submitting ? (
                <>
                  <div className="upload-container">
                  <input className="upload-pdf" ref={pdfHolder} id="pdfFiles"   name="pdfs" accept=".pdf" type="file" onChange={handlePdfCount} multiple />
                  <label htmlFor="pdfFiles" className="upload-label">
                    <span className="upload-icon">📁</span> Upload PDF Files
                  </label>
                  <span className="file-count" ref={pdfDis} id="file-count">{mssg}</span>
                  <button>Submit</button>
                </div>
                </>
              ):(
                <h3>Submitting ......</h3>
              )
            }
          </form>
        </div>
      }
      {
        openProfileForm &&
        <div className="profile-form">
          <i className="fa-solid fa-xmark" onClick={()=>{setOpenProfileForm(false)}}></i>
          <form onSubmit={formik1.handleSubmit} className="register-form" >

            <div className="section"    >
         
              <div className="inp-block-img">
                
                 <label htmlFor="profilePhoto">
                  <img className="add profile-img" src={data.profilePhoto || "https://img.freepik.com/premium-vector/avatars-default-photo-placeholder-multiracial-profile-pictures_116137-1820.jpg"} alt="" />
                 </label>
                 <input
                    type="file"
                    hidden
                    // ref={fileInputRef}
                    id="profilePhoto"
                    name="profilePhoto"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    // value={formik1.values.profilePhoto}  
                    onBlur={formik1.handleBlur}
                  />
                 {formik1.errors.profilePhoto && formik1.touched.profilePhoto ? <p>{formik1.errors.profilePhoto}</p>:null}
              </div>
            </div>
            <div className="section"    >
              <h4>General Details</h4>
              <div className="inp-block">
                <div className="input-block">
                  <label htmlFor="fName">First Name</label>
                  <input
                    type="name"
                    autoComplete="off"
                    name="fName"
                    id="fName"
                    placeholder="Your First Name"
                    value={formik1.values.fName}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.fName && formik1.touched.fName ? <p>{formik1.errors.fName}</p> : null}
                </div>
                <div className="input-block">
                  <label htmlFor="lName">Last Name</label>
                  <input
                    type="name"
                    autoComplete="off"
                    name="lName"
                    id="lName"
                    placeholder="Your Last Name"
                    value={formik1.values.lName}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.lName && formik1.touched.lName ? <p>{formik1.errors.lName}</p> : null}
                </div>

                <div className="input-block">
                  <label htmlFor="dob">Date Of Birth</label>
                  <input
                    type="date"
                    autoComplete="on"
                    name="dob"
                    id="dob"
                    placeholder="mm/dd/yyyy"
                    value={formik1.values.dob}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.dob && formik1.touched.dob ? <p>{formik1.errors.dob}</p> : null}
                </div>
                <div className="input-block">
                  <label htmlFor="mob">Mobile Number</label>
                  <input
                    type="number"
                    autoComplete="off"
                    name="mob"
                    id="mob"
                    maxLength="10"
                    placeholder="Your Mobile Number"
                    value={formik1.values.mob}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.mob && formik1.touched.mob ? <p>{formik1.errors.mob}</p> : null}
                </div>
                <div className="input-block">
                  <label htmlFor="gender">Gender</label>
                  <select
                    className="styled-select"
                    name="gender"
                    id="gender"
                    value={formik1.values.gender}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formik1.errors.gender && formik1.touched.gender ? <p>{formik1.errors.gender}</p> : null}
                </div>

              </div>
            </div>

            <div className="section">
              <h4>Latest  Education Details </h4>
              <div className="inp-block">
                <div className="input-block">
                  <label htmlFor="fName">Name of your  college/university ?</label>
                  <input
                    type="text"
                    autoComplete="off"
                    name="college"
                    id="college"
                    placeholder="University Name"
                    value={formik1.values.college}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.college && formik1.touched.college ? <p>{formik1.errors.college}</p> : null}
                </div>
                <div className="input-block">
                  <label htmlFor="lName">Years of Experience in Tutoring</label>
                  <input
                    type="number"
                    autoComplete="off"
                    name="expYear"
                    id="expYear"
                    placeholder="Your years of experience"
                    value={formik1.values.expYear}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.expYear && formik1.touched.expYear ? <p>{formik1.errors.expYear}</p> : null}
                </div>

              </div>
            </div>

            <div className="section">
              <h4> Address Details </h4>
              <div className="inp-block">
                <div className="input-block">
                  <label htmlFor="fName">Your Address</label>
                  <input
                    type="text"
                    autoComplete="off"
                    name="addr"
                    id="addr"
                    placeholder="University Name"
                    value={formik1.values.addr}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.addr && formik1.touched.addr ? <p>{formik1.errors.addr}</p> : null}
                </div>
                <div className="input-block">
                  <label htmlFor="lName">PinCode</label>
                  <input
                    type="number"
                    autoComplete="off"
                    name="pinCode"
                    id="pinCode"
                    placeholder="Your years of experience"
                    value={formik1.values.pinCode}
                    onChange={formik1.handleChange}
                    onBlur={formik1.handleBlur}
                  />
                  {formik1.errors.pinCode && formik1.touched.pinCode ? <p>{formik1.errors.pinCode}</p> : null}
                </div>

              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      }
      
      {
        openSlotForm && 
        <div className="tutor-course-select">
          <TutorCourseList setOpenSlotForm={setOpenSlotForm} setOpenSlotSelect={setOpenSlotSelect} />
        </div>
      }

      {
        openSlotSelect &&
            <TutorSlotSelector formik2={formik2} setOpenSlotSelect={setOpenSlotSelect}/>
      }
      {
        openSlotUpdate &&
            <TutorSlotSelector formik2={formik3} setOpenSlotSelect={setOpenSlotUpdate}/>
      }
      <div className="content">
        <div className="dettss">
          <div className="profile-image">
            <img src={data?.profilePhoto || "https://img.freepik.com/premium-vector/avatars-default-photo-placeholder-multiracial-profile-pictures_116137-1820.jpg"} alt="" />
          
          </div>
          <div className="info">
            <h3>{data?.fName+" "+data?.lName}</h3>
            <p><i className="fa-solid fa-location-dot" style={{marginRight:"1rem"}}></i>{data?.addr}</p>
            <div className="actions">
              <button onClick={handleProfileForm}>
                Edit Profile
              </button>
              <button onClick={() => {
                setMssg('No Files are selected')
                setOpenPdfForm(!openPdfForm)
              }}>
                Submit Your Resume / Docs
              </button>
            </div>
          </div>
        </div>

        <div className="tut-slots">
          <button onClick={() => setOpenSlotForm(!openSlotForm)}>
            Choose Course
          </button>
          {slots && slots.length>0 ? 
            (slots.map((slot,index) => (
              <div className="schedule" key={index}> {/* Add a key for each item in a list */}
                <div className="heading">
                  <h4>{slot.courseId.courseName}</h4>
                  <p>{slot.courseId.board}</p>
                  <p> Grade : {slot.courseId.grade}</p>
                </div>
                <div className="time-slots">
                  {slot.slots.map((data,index) => (
                    <p key={index}> {/* Add a key for each item in a list */}
                      {data.label}
                    </p>
                  ))}
                </div>
                <div className="actions">
                  <button onClick = {()=>handleSlotUpdate(slot)}>Edit</button>
                  <button onClick = {()=>handleSlotDelete(slot.courseId._id)}>Delete</button>
                </div>
              </div>
            ))):(
              <p>No Slots Added</p>
            )
          }
        </div>
      </div>
    </>
  )
}

export default TutorProfile
