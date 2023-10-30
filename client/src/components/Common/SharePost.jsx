import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton } from 'react-share';
function SharePost({shareUrl,title}) {
  return (
    <>
        <FacebookShareButton url={shareUrl} quote={title}>
                    <img src="https://i.pinimg.com/originals/ce/d6/6e/ced66ecfc53814d71f8774789b55cc76.png" alt="" />
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={title}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2496/2496110.png" alt="" />
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={title}>
                    <img src="https://img.freepik.com/premium-vector/whatsapp-icon-design_23-2147918673.jpg" alt="" />
                </WhatsappShareButton>

                <LinkedinShareButton url={shareUrl} title={title}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA2Nk4gWhkvvzLbxIyxs_fy7TBN3KBGxJstQ&usqp=CAU" alt="" />
                </LinkedinShareButton>
    </>
  )
}

export default SharePost
