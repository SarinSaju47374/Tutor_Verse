function Comment({comment}) {
  return (
    <>
        <div className="comment">
            <div className="comment-content">
                {comment?.comment}
            </div>
            <div className="actions">
                <button>Reply</button> 
                <button>Delete</button> 
            </div>
        </div>
        <div style={{paddingLeft:"3rem",marginTop:"20px"}}>
            {
                comment?.replies.map(ele=>{
                    return <Comment comment={ele} key={ele.id}/>
                })
            }
        </div>
    </>
  )
}

export default Comment
