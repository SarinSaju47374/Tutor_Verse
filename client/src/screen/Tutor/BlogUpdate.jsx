import { useState, useRef, useEffect } from 'react'
import "../../scss/screen/Tutor/BlogCreate.scss"
import ReactQuill from 'react-quill';
import CloudinaryUploadWidget from '../../components/Common/CloudinaryUploadWidget';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { blogSchema } from '../../schemas';
import { useFormik } from 'formik';
import { useParams ,useNavigate} from "react-router-dom"
import 'react-quill/dist/quill.snow.css';
import axios from '../../axios';
import { toast } from "react-toastify";
import Filter from 'bad-words';
import { image } from '@cloudinary/url-gen/qualifiers/source';
const BlogUpdate = () => {
    let { bid } = useParams()
    let category = [
        "Technology", "Mathematics", "Language", "Education", "Money", "Pschycology"
    ]

    const [publicId, setPublicId] = useState("");
    const [cloudName] = useState(import.meta.env.VITE_CLOUD_NAME);
    const [uploadPreset] = useState(import.meta.env.VITE_PRESET);
    const [imageUrl, setImageUrl] = useState("");
    const [data, setData] = useState("")
    const filter = new Filter();
    const navigate = useNavigate();
    const [uwConfig] = useState({
        cloudName,
        uploadPreset,
        cropping: true,
        folder: "user_images",
        clientAllowedFormats: ["jpeg", "png", "jpg"],
    });

    const cld = new Cloudinary({
        cloud: {
            cloudName
        }
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            category: '',
            imageUrl: '',
        },
        validationSchema: blogSchema,
        onSubmit: async (values) => {
            try {
                const offensiveWords = filter.clean(values.content);
                const offensiveWords2 = filter.clean(values.title);
                if (offensiveWords !== values.content || offensiveWords2 !== values.title) {
                    toast.error('This content contains offensive words. Please remove them before publishing.');
                } else {
                    values.bid = bid
                    let response = await axios.post("/update-blog",values);
                    if (response.data.err) {
                        toast.error(response.data.err)
                    } else {
                        toast.success(response.data.success)
                        setTimeout(()=>{
                            navigate("/tutor/blogs")
                        },2000)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
    });
    useEffect(() => {
        async function run() {
            try {
                let response = await axios.get("view-blog", {
                    params: {
                        bid: bid,
                    }
                })
                setData(response.data.blogs[0])
                console.log(response.data)
                formik.setValues({
                    title: response.data.blogs[0].title,
                    content: response.data.blogs[0].content,
                    category: response.data.blogs[0].category,
                    imageUrl: response.data.blogs[0].image,
                })
                setImageUrl(response.data.blogs[0].image)
            } catch (err) {
                console.log(err)
            }

        }
        run()
    },[])

    useEffect(() => {
        
        formik.setFieldValue("imageUrl", imageUrl)
    }, [imageUrl])
    const myImage = cld.image(publicId);
   
    console.log("😎",myImage)
    return (
        <div className="blog-create-page">
            <h2>Create Your Blog</h2>
            <div className="blog-section">

                <div className="blog-image-preview">
                    <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} setImageUrl={setImageUrl} />
                    {myImage.publicID ?
                        <div className="preview">
                            <AdvancedImage
                                className="blog-image"
                                cldImg={myImage}
                                plugins={[responsive(), placeholder()]}
                            />
                        </div >
                        :
                        <div className="preview">
                            <img src = {imageUrl}alt=""/>
                        </div>

                    }
                </div>

                <form className="blog-content">
                    <div className="blog-inp">
                        <label htmlFor="blog-title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <div className="error">{formik.errors.title}</div>
                        ) : null}
                    </div>
                    <div className="blog-inp">
                        <label htmlFor='content'>Your content</label>
                        <ReactQuill
                            theme="snow"
                            id="content"
                            value={formik.values.content}
                            onChange={(value) => formik.setFieldValue('content', value)}
                        />
                        {formik.touched.content && formik.errors.content ? (
                            <div className="error">{formik.errors.content}</div>
                        ) : null}
                    </div>
                    <div className="blog-inp">
                        <label htmlFor='blog-category'>Category</label>
                        <select
                            name="category"
                            id="blog-category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.category}
                        >
                            <option value="" label="Choose the Category" disabled />
                            {category.map((elem, index) => (
                                <option value={elem} key={index}>{elem}</option>
                            ))}
                        </select>
                        {formik.touched.category && formik.errors.category ? (
                            <div className="error">{formik.errors.category}</div>
                        ) : null}
                    </div>

                    <button className="publish" type="submit" onClick={formik.handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default BlogUpdate;
