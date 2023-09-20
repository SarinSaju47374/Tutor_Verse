import "../scss/pages/ForgotPage.scss"
import { useFormik } from 'formik'
import { resetSchema } from '../schemas'
import { useNavigate, useParams } from "react-router-dom"
import axios from "../axios"
import { ToastContainer,toast } from "react-toastify"
 
function ResetPassword() {
    let navigate = useNavigate();
    let {id,tk,user} = useParams();

    const initialValues = {
        psswd:"",
        cnfrm_psswd:""
    }
    const {values,errors,handleSubmit,handleChange,handleBlur,touched} =useFormik({
        initialValues:initialValues,
        validationSchema:resetSchema,
        onSubmit:async (values)=>{
            let response = await axios.post(`/reset-psswd/${id}/${tk}/${user}`,{psswd:values.psswd})
            if(response.data.err){
                toast.error("Something Went Wrong!")
                setTimeout(()=>{
                    navigate("/forgot")
                },1000)
            }else{
                toast.success("Your password has been successfully reset")
                setTimeout(()=>{
                    if(user=="student"){
                        navigate("/login/student");
                    }else{
                        navigate("/login/tutor");
                    }
                },1200)
            }
        }
    });

  return (
    <div className="forgot-page">
      <ToastContainer/>
      <form className="container" onSubmit={handleSubmit}>
            <h4>HMMMM! Forgot your Password? Enter your Mail.</h4>
            <input 
                type="password"
                name="psswd"
                id="psswd"
                placeholder="Enter your New Password"
                value = {values.psswd}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {errors.psswd && touched.psswd ? <p>{errors.psswd}</p>:null}
            <input 
                type="password"
                name="cnfrm_psswd"
                id="cnfrm_psswd"
                value={values.cnfrm_psswd}
                placeholder="Confirm your New Password"
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {errors.cnfrm_psswd && touched.cnfrm_psswd ? <p>{errors.cnfrm_psswd}</p>:null}
            <button>Submit</button>
      </form>
    </div>
  )
}

export default ResetPassword
