import "../scss/pages/ForgotPage.scss"
import { useFormik } from 'formik'
import { forgotSchema } from '../schemas'
import axios from "../axios"
import { ToastContainer ,toast} from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
function ForgotPage() {
  let navigate = useNavigate();
  let {user} = useParams();
    const initialValues = {
        email:"", 
    }
    const {values,errors,handleSubmit,handleChange,handleBlur,touched} =useFormik({
        initialValues:initialValues,
        validationSchema:forgotSchema,
        onSubmit:async (values,action)=>{
            let response = await axios.post(`/forgot-psswd/${user}`,values)
            if(response.data.err){
              toast.error(response.data.err)
              action.resetForm();
            }else{
              toast.success("The mail has been sent! Click the sent Link");
              setTimeout(()=>{
                navigate(-1);
              },1200)
            }
        }
    });

  return (
    <div className="forgot-page">
      <ToastContainer/>
      <form className="container" onSubmit={handleSubmit}>
            <h4>Forgot your Password? Enter your Mail.</h4>
            <input 
                type="text"
                name="email"
                id="email"
                placeholder='Enter the Email id'
                value = {values.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {errors.email && touched.email ? <p>{errors.email}</p>:null}
            <button>Submit</button>
      </form>
    </div>
  )
}

export default ForgotPage
