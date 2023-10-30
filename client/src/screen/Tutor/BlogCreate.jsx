import { useState, useRef, useEffect } from 'react'
import "../../scss/screen/Tutor/BlogCreate.scss"
import ReactQuill from 'react-quill';
import {useNavigate} from 'react-router-dom';
import CloudinaryUploadWidget from '../../components/Common/CloudinaryUploadWidget';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { blogSchema } from '../../schemas';
import { useFormik } from 'formik';
import 'react-quill/dist/quill.snow.css';
import axios from '../../axios';
import { toast } from "react-toastify";
import Filter from 'bad-words';
const BlogCreate = () => {
    let category = [
        "Technology", "Mathematics", "Language", "Education", "Money", "Pschycology"
    ]
    const navigate  = useNavigate();
    const [publicId, setPublicId] = useState("");
    const [cloudName] = useState(import.meta.env.VITE_CLOUD_NAME);
    const [uploadPreset] = useState(import.meta.env.VITE_PRESET);
    const [imageUrl, setImageUrl] = useState("");
    const filter = new Filter();
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
                    let response = await axios.post("/add-blog", values);
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
        formik.setFieldValue("imageUrl", imageUrl)
    }, [imageUrl])
    const myImage = cld.image(publicId);
    console.log(imageUrl)
    return (
        <div className="blog-create-page">
            <h2>Create Your Blog</h2>
            <div className="blog-section">

                <div className="blog-image-preview">
                    <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} setImageUrl={setImageUrl} />
                    {imageUrl ?
                        <div className="preview">
                            <AdvancedImage
                                className="blog-image"
                                cldImg={myImage}
                                plugins={[responsive(), placeholder()]}
                            />
                        </div >
                        :
                        <div className="preview">No image</div>

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

                    <button className = "publish" type="submit" onClick={formik.handleSubmit}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default BlogCreate;
