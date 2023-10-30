import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import "../scss/screen/Tutor/BlogPage.scss";
import axios from "../axios"
import SharePost from "../components/Common/SharePost";

function BlogPage() {
    let {bid} = useParams();
    const [data,setData] = useState({});
    
    useEffect(() => {
        async function run(){
            let response = await axios.get("/view-spec-blog",{
                params:{
                    bid:bid
                }
            })
            setData(response.data)
        }
        run()
    }, []);
    const title = data.title;
    const shareUrl = `${import.meta.env.VITE_CLIENT_URL}/tutor/blog/${bid}`;
    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const timeDifference = now - date;
    
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const monthsDifference = Math.floor(daysDifference / 30);
    
        if (daysDifference === 0) {
            return "today";
        } else if (daysDifference >= 28) {
            return `${monthsDifference} months ago`;
        } else {
            return `${daysDifference} days ago`;
        }
    }
    return (
        <div className="blog-page-desc">
            <div className="image-blog" style={{backgroundImage: `url(${data.image})`}}>
                <div className="info">
                    <div className="left-head">
                        <i className="fa-solid fa-pen-nib"></i>
                    </div>
                    <div className="right-head">
                        <h3>{data.category}</h3>
                        <h2>{data.title}</h2>
                        <div className="author">
                            <img src={data.author?.profilePhoto} alt="" />
                            <p>Author : {data.author?.fName}{' '}{data.author?.lName} , {timeAgo(data.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: data.content }}> 

                
            </div>
            <div className="share-post">
                <SharePost shareUrl={shareUrl} title={title} />
            </div>
        </div>
    )
}

export default BlogPage
