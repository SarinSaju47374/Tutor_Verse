import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { signUpTutorSchema } from "../schemas";
import { Link ,useNavigate} from "react-router-dom"
import "../scss/pages/RegisterTutor.scss"
import { Dna } from "react-loader-spinner"
import { ToastContainer, toast } from "react-toastify"
import axios from "../axios";
function RegisterTutor() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [data,setData] = useState({});
    const [otpPage,setOtpPage] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [otp,setOtp]  = useState("");
    const navigate = useNavigate();
    useEffect(() => {
       
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Simulating 2 seconds of loading time

        return () => {
            clearTimeout(loadingTimeout);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const backgroundPositionY = `${scrollPosition / 2}px`;
    const initialValues = {
        fName: "",
        lName: "",
        email: "",
        dob: "",
        mob: "",
        gender: "Male",
        college: "",
        expYear: "",
        addr: "",
        pinCode: "",
        psswd: "",
        cnfrm_psswd: "",
        termsAccepted: false,

    }
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: signUpTutorSchema,
        onSubmit: async (values, action) => {
            setData(values);
           setOtpPage(!otpPage)
           
           await axios.post('/send-otp',{
                email:values.email
            
           })
        //    return
        }
    })
    async function  handleOtpSubmit(e){
        e.preventDefault()
        let response = await axios.post('/verify-otp',{
         
                email:data.email,
                otp:otp,
           
        })
        if(response.data.otpPresent){
            toast.success("You are successfully verified");
            const response = await axios.post('/register-tutor', data);
            toast.success(response.data);
            setTimeout(()=>{
                navigate("/login/tutor");
            },3000)
        }else{
            toast.error("Wrong OTP")
        }
   }
   function handleOtpChange(e){
        setOtp(e.target.value);
   }

   async function handleResend(){

    await axios.post('/send-otp',{
        
            email:data.email
 
        
       })
    toast.success("OTP sent to your Mail!")
   }
    return (
        <>
            {isLoading &&
                <Dna
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{ position: "fixed", zIndex: "100", width: "100%", height: "20%", top: "40%" }}
                    wrapperClass="dna-wrapper"
                />
            }
            {!isLoading &&
                <div className="register-container">
                    <ToastContainer />
                    <div className="register-banner" style={{ backgroundPosition: `center ${backgroundPositionY}` }}>
                        <h2>Become A Tutor</h2>
                        <Link to="/login/tutor">Login As a Tutor</Link>
                    </div>
                    <form onSubmit={handleSubmit}>

                        <div className="section">
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
                                        value={values.fName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.fName && touched.fName ? <p>{errors.fName}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="lName">Last Name</label>
                                    <input
                                        type="name"
                                        autoComplete="off"
                                        name="lName"
                                        id="lName"
                                        placeholder="Your Last Name"
                                        value={values.lName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.lName && touched.lName ? <p>{errors.lName}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        autoComplete="on"
                                        name="email"
                                        id="email"
                                        placeholder="yourmail@gmail.com"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.email && touched.email ? <p>{errors.email}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="dob">Date Of Birth</label>
                                    <input
                                        type="date"
                                        autoComplete="on"
                                        name="dob"
                                        id="dob"
                                        placeholder="mm/dd/yyyy"
                                        value={values.dob}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.dob && touched.dob ? <p>{errors.dob}</p> : null}
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
                                        value={values.mob}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.mob && touched.mob ? <p>{errors.mob}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        className="styled-select"
                                        name="gender"
                                        id="gender"
                                        value={values.gender}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && touched.gender ? <p>{errors.gender}</p> : null}
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
                                        value={values.college}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.college && touched.college ? <p>{errors.college}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="lName">Years of Experience in Tutoring</label>
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        name="expYear"
                                        id="expYear"
                                        placeholder="Your years of experience"
                                        value={values.expYear}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.expYear && touched.expYear ? <p>{errors.expYear}</p> : null}
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
                                        value={values.addr}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.addr && touched.addr ? <p>{errors.addr}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="lName">PinCode</label>
                                    <input
                                        type="number"
                                        autoComplete="off"
                                        name="pinCode"
                                        id="pinCode"
                                        placeholder="Your years of experience"
                                        value={values.pinCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.pinCode && touched.pinCode ? <p>{errors.pinCode}</p> : null}
                                </div>

                            </div>
                        </div>

                        <div className="section">
                            <h4> Password Details </h4>
                            <div className="inp-block">
                                <div className="input-block">
                                    <label htmlFor="psswd">Password</label>
                                    <input
                                        type="password"
                                        autoComplete="off"
                                        name="psswd"
                                        id="psswd"
                                        placeholder="Your Password"
                                        value={values.psswd}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.psswd && touched.psswd ? <p>{errors.psswd}</p> : null}
                                </div>
                                <div className="input-block">
                                    <label htmlFor="psswd">Confirm Password</label>
                                    <input
                                        type="password"
                                        autoComplete="off"
                                        name="cnfrm_psswd"
                                        id="cnfrm_psswd"
                                        placeholder="Your Password Again"
                                        value={values.cnfrm_psswd}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.cnfrm_psswd && touched.cnfrm_psswd ? <p>{errors.cnfrm_psswd}</p> : null}
                                </div>
                            </div>
                        </div>

                        <div className="section-check">
                            <h4>General terms and conditions for a tutor</h4>
                            <ul>
                                <li>You are aware that you alone have the final say in which student recieves the tution.</li>
                                <li>You understand and acknowledge that you will only instruct the pupil when atleast one parent is home.</li>
                            </ul>
                            <Link>Read More</Link>
                            <div className="terms">
                                <input
                                    type="checkbox"
                                    id="termsAccepted"
                                    name="termsAccepted"
                                    checked={values.termsAccepted}
                                    onChange={handleChange}
                                /> <p>I agree to the Given terms and Condition</p>
                            </div>
                            {errors.termsAccepted && touched.termsAccepted ? <p className="err">{errors.termsAccepted}</p> : null}
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                    <div className="otp-container" style={{display:otpPage?"grid":"none"}}>
                        <form className="otp" onSubmit={handleOtpSubmit}>
                            Enter the OTP sent to your Mentioned Mail ID.
                            <input type="number" 
                                onChange={handleOtpChange}
                            />
                            <div className="btns">
                                <button>Verify</button>
                                <Link onClick={()=>{
                                    setOtpPage(false);
                                }}>Cancel</Link>
                                <Link onClick={handleResend}>Resend ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default RegisterTutor
