import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../scss/screen/Tutor/BlogPage.scss";
import axios from "../axios"
import SharePost from "../components/Common/SharePost";
import RelatedPosts from "../components/Common/RelatedPosts";
import Comment from "../components/Common/Comment";

let comments = [
    {
        id:1,
        comment:"Hi there!",
        userId:2121,
        replies:[
            {
                id:11,
                comment:"Hey sinima !",
                userId:2521,
                replies:[
                    {
                        id:111,
                        comment:"Hey Janu !",
                        userId:2721,
                        replies:[
                            
                        ]
                    },
                    {
                        id:112,
                        comment:"Hey Teresa !",
                        userId:2561,
                        replies:[
                            
                        ]
                    },
                ]
            }
        ]
    },
    {
        id:2,
        comment:"World is a better place!",
        userId:2521,
        replies:[
            {
                id:112,
                comment:"Bam Bam !",
                userId:2561,
                replies:[
                    
                ]
            },
        ]
    },
    {
        id:3,
        comment:"Great amigos!",
        userId:2121,
        replies:[
        ]
    }
]
function BlogPageStudent() {
    let { bid } = useParams();
    const [data, setData] = useState({});
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [show,setShow] = useState(false);

    useEffect(() => {
        async function run() {
            let response = await axios.get("/view-spec-blog", {
                params: {
                    bid: bid
                }
            })
            setData(response.data)
            let response2 = await axios.get("/view-blog", {
                params: {
                    nid: response.data._id,
                    searchQuery: response.data.category
                }
            })
            console.log(response2.data)
            setRelatedPosts(response2.data)
        }
        run()
    }, [bid]);
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
            <div className="image-blog" style={{ backgroundImage: `url(${data.image})` }}>
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

            
            <div className="add-comment">
                <input type="text" name="" id="" placeholder="Add your Comment"/>
                <i className="fa-regular fa-comment-dots"></i>
            </div>            

            {
                comments.length>0 && <button onClick={()=>setShow(!show)} style={{display:"block"}}>Show Comments</button>
            }

            {
                show && 
                <div className="comments">
                    {
                        comments.map(ele=>{
                        return <Comment comment = {ele} key={ele.id} />})
                    }
                </div>
            }
            {
                relatedPosts && relatedPosts?.blogs?.length > 0 &&
                <div className="related-posts">
                    <h2 className="title-rel">Related Posts</h2>
                    <RelatedPosts data={relatedPosts} />
                </div>
            }

            
        </div>
    )
}

export default BlogPageStudent
