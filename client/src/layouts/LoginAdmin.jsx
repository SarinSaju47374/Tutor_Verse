import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import "../scss/pages/LoginStudent.scss";
import { loginSchema } from "../schemas"
import { useFormik } from "formik"
import { Dna } from "react-loader-spinner"
import {ToastContainer,toast} from "react-toastify";
import axios from "../axios"
function LoginAdmin() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      return () => {
        clearTimeout(loadingTimeout);
      }
    }, 800);
    async function reset(){
      await axios.get("/reset-session")
    }
    reset();
  }, [])
  const initialValues = {
    email: "",
    psswd: "",
  }
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      console.log(values);
      let response = await axios.post("/login-admin",values);
      if(response.data.err){
        toast.error(response.data.err)
      }else{
        toast.success(response.data)
        setTimeout(()=>{
          navigate("/")
        },1000)
      }
    }
  })

  function handleShow() {
    setShow(!show);
  }
  return (
    <>
      {loading &&
        <Dna
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{ position: "fixed", zIndex: "100", width: "100%", height: "20%", top: "40%" }}
          wrapperClass="dna-wrapper"
        />
      }

      {
        !loading &&
        <div className="container">
          <ToastContainer/>
          <div className="login-form">
            <div className="frm">
              <form action="" className="frm-bs" onSubmit={handleSubmit}>
                <h2> Admin Login</h2>
                <p>Welcome back! Login to your account</p>
                <div className="inp-kit">
                  <label htmlFor="email">Email Address</label>
                  <div className="err">
                    {errors.email && touched.email ? <>{errors.email}</> : null}
                  </div>
                  <div className="inp">
                    <div className="logo"><i className="fa-solid fa-envelope"></i></div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="email-cls"
                    />
                  </div>
                </div>

                <div className="inp-kit">
                  <label htmlFor="psswd">Password</label>
                  <div className="err">
                    {errors.psswd && touched.psswd ? <>{errors.psswd}</> : null}
                  </div>
                  <div className="inp">
                    <div className="logo"><i className="fa-solid fa-unlock-keyhole"></i></div>
                    <input
                      type={show ? "text" : "password"}
                      id="psswd"
                      name="psswd"
                      values={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="psswd-cls"
                    />
                    {show ? <i className="fa-solid fa-eye-slash" onClick={handleShow}></i> :
                      <i className="fa-solid fa-eye" onClick={handleShow}></i>
                    }
                  </div>
                </div>
              {/* <div className="options">
                <Link to="/register/tutor">Register as a Tutor</Link>
                <Link to="/login/student">Login as a Student</Link>
                <Link>Forgot password ?</Link>
              </div> */}
              <button>Sign In</button>
              </form>
            </div>
          </div>
          <div className="login-img" style={{ backgroundImage: "url('../../public/images/admin.jpg')" }}>

          </div>
        </div>
      }

    
    </>
  )
}

export default LoginAdmin