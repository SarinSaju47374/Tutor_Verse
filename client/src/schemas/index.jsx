import * as Yup from "yup";
import axios from "../axios";
import debounce from "lodash/debounce";

const asyncMailValidation = debounce(async function (value) {
    try {
        const response1 = await axios.post('/student-mail-check', {
          
                email: value
            
        });

        const data1 = response1.data;

        const response2 = await axios.post('/tutor-mail-check', {
           
                email: value
           
        });
        console.log("👏")
        const data2 = response2.data;
        return data1.isUnique && data2.isUnique; // Assuming your API returns a boolean indicating email uniqueness
 
    } catch (error) {
        console.error('Error checking email:', error);
        return false; // Return false in case of an error
    }

}, 800);
 
export const signUpTutorSchema = Yup.object({

    fName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your FirstName"),

    lName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your LastName"),

    email: Yup
        .string()
        .email("Must be a valid mail")
        .test('unique-email', 'Email already exists', asyncMailValidation)
        .required("Your email address"),

    // dob: Yup
    //     .date()
    //     .max(new Date('2005/01/01'), "Date of birth cannot be after January 1, 2005")
    //     .required("Please enter your date of birth"),

    // mob: Yup
    //     .string()
    //     .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    //     .required("Please enter your mobile number"),

    // gender: Yup
    //     .string()
    //     .required("Please mention your Gender"),

    // college: Yup
    //     .string()
    //     .required("Your college / University name must be mentioned"),

    // expYear: Yup
    //     .number()
    //     .integer('Years of experience must be a whole number')
    //     .min(0, 'Years of experience cannot be negative')
    //     .max(50, 'Years of experience cannot exceed 50'),

    // addr: Yup
    //     .string()
    //     .required("Must mention your Address"),

    // pinCode: Yup
    //     .string()
    //     .matches(/^[1-9][0-9]{5}$/, 'Invalid Pincode')
    //     .required('Pincode is required'),

    psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        .required("Enter your password"),

    cnfrm_psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .required("You must enter the confirmed password")
        .oneOf([Yup.ref("psswd"), null], "Password Must Match"),

    termsAccepted: Yup
        .boolean()
        .test('is-true', 'Must accept the Terms before you proceed', value => value === true)
        .required("Must accept the Terms before you proceed"),
})

export const profileUpdationSchema = Yup.object({

    fName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your FirstName"),

    lName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your LastName"),

    dob: Yup
        .date()
        .max(new Date('2005/01/01'), "Date of birth cannot be after January 1, 2005")
        .required("Please enter your date of birth"),

    mob: Yup
        .string()
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Please enter your mobile number"),

    gender: Yup
        .string()
        .required("Please mention your Gender"),

    college: Yup
        .string()
        .required("Your college / University name must be mentioned"),

    expYear: Yup
        .number()
        .required("The years of experince must be mentioned")
        .integer('Years of experience must be a whole number')
        .min(0, 'Years of experience cannot be negative')
        .max(50, 'Years of experience cannot exceed 50'),

    addr: Yup
        .string()
        .required("Must mention your Address"),

    pinCode: Yup
        .string()
        .matches(/^[1-9][0-9]{5}$/, 'Invalid Pincode')
        .required('Pincode is required'),
    profilePhoto:Yup
        .mixed()
        .required('Image is required')
     
})

export const signUpStudentSchema = Yup.object({

    fName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your FirstName"),

    lName: Yup
        .string()
        .min(2, "Must have atleast 2 characters")
        .max(25)
        .required("Please enter your LastName"),

    // gName: Yup
    //     .string()
    //     .min(2, "Must have atleast 2 characters")
    //     .max(25)
    //     .required("Please enter your Guardians name"),

    // relation: Yup
    //     .string()
    //     .min(2, "Must have atleast 2 characters")
    //     .max(25)
    //     .required("Please enter this field"),

    email: Yup
        .string()
        .email("Must be a valid mail")
        .test('unique-email', 'Email already exists', asyncMailValidation)
        .required("Your email address"),

    // dob: Yup
    //     .date()
    //     .max(new Date(), "Date of birth cannot be after January 1, 2005")
    //     .required("Please enter your date of birth"),

    mob: Yup
        .string()
        .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
        .required("Please enter your mobile number"),

    gender: Yup
        .string()
        .required("Please mention your Gender"),

    // school: Yup
    //     .string()
    //     .required("Must enter schools name"),

    // board: Yup
    //     .string()
    //     .required("Your Board must be mentioned"),

    // medium: Yup
    //     .string()
    //     .required("Enter your medium!"),

    // addr: Yup
    //     .string()
    //     .required("Must mention your Address"),

    // pinCode: Yup
    //     .string()
    //     .matches(/^[1-9][0-9]{5}$/, 'Invalid Pincode')
    //     .required('Pincode is required'),

    psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        .required("Enter your password"),

    cnfrm_psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .required("You must enter the confirmed password")
        .oneOf([Yup.ref("psswd"), null], "Password Must Match"),


})

export const loginSchema = Yup.object({
    email: Yup
        .string()
        .email()
        .required("Must enter a Valid Email"),
    psswd: Yup
        .string()
        .required("Password is required Field")
})

export const forgotSchema = Yup.object({
    email: Yup
        .string()
        .email()
        .required("Must enter a Valid Email"),
})

export const resetSchema = Yup.object({
    psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        .required("Enter your password"),

    cnfrm_psswd: Yup
        .string()
        .min(6, "Password Must be atleast 6 Characters")
        .required("You must enter the confirmed password")
        .oneOf([Yup.ref("psswd"), null], "Password Must Match"),
})


export const courseAddSchema = Yup.object({
    courseName: Yup
        .string()
        .required("Must enter course name"),
    grade: Yup
        .number()
        .min(1, 'Number must be greater than 1')
        .required('Number is required')
        .typeError('Invalid Grade'),
    board: Yup
        .string()
        .required('Board is required'),
    price: Yup
        .number()
        .min(3000, 'Number must be greater than 3000')
        .required('Number is required')
        .typeError('Invalid Grade'),
    // selectedSlots:Yup
    //     .array()
    //     .min(1,"Choose atleast 1 timeslot amigo")
    //     .required(),
    duration:Yup
        .number()
        .min(1,"Number must be greater then equal to 1")
        .required("Duration is a required field"),  
    desc:Yup
        .string()
        .required("Enter the Description"),
    image:Yup
        .mixed()
        .required('Image is required')
})


export const tutorSlotSchema = Yup.object({
    courseId: Yup
        .string(),
    userId: Yup
        .string(),
    selectedSlots:Yup
        .array()
        .min(1,"Choose atleast 1 timeslot amigo")
        .required(),
})

export const blogSchema = Yup.object({
    title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  category: Yup.string().required('Category is required'),
  imageUrl: Yup.string().required('Image is required'),
})
