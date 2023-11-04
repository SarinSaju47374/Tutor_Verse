import {toast} from 'react-toastify';
import axios from '../../axios';

function BookingComponent({ data ,setMod,mod}) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    async function handleCancel(bid) {
        let response  = await axios.post("/cancellation-request",{
            bid
        }) 
        if(response.data.message){
            toast.success(response.data.message)
            setMod(!mod)
        }else{toast.success(response.data.error)} 
    }
    return (
        <div className="booking-list-child">
            <div className="table">
                <div className="thead">
                    <div className="th">

                        <div className="td">
                            Tutor
                        </div>
                        <div className="td">
                            Subject
                        </div>
                        <div className="td">
                            Board
                        </div>
                        <div className="td">
                            Booking Price
                        </div>
                        <div className="td">
                            Booking Date
                        </div>
                        <div className="td">
                            Start Date
                        </div>
                        <div className="td">
                            End Date
                        </div>
                        <div className="td">
                            Action
                        </div>
                    </div>
                </div>
                <div className="tbody">
                    {data.length > 0 ? (
                        data.map(ele => (
                            <div className="trow" key={ele.id}> {/* Assuming there's an ID for each element */}
                                <div className="td">{ele.tutorId.fName}{" "}{ele.tutorId.lName}</div>
                                <div className="td">{ele.courseId.courseName}</div>
                                <div className="td">{ele.courseId.board}</div>
                                <div className="td">Rs {ele.pricePaid}</div>
                                <div className="td">{new Date(ele.createdAt).toLocaleDateString(undefined, options)}</div>
                                <div className="td">{new Date(ele.startDate).toLocaleDateString(undefined, options)}</div>
                                <div className="td">{new Date(ele.endDate).toLocaleDateString(undefined, options)}</div>
                                <div className="td">
                                    {
                                        !ele?.cancellationRequest?.requestedByStudent ? (
                                            <button onClick={() => handleCancel(ele._id)}> Cancel </button>
                                        ) : (
                                            (() => {
                                                switch (ele?.cancellationRequest?.cancellationStatus) {
                                                    case 'approved':
                                                        return <div className="approved status">Approved</div>;
                                                    case 'disapproved':
                                                        return <div className="disapproved status">Rejected</div>;
                                                    case 'pending':
                                                        return <div className="pending status">Pending for Approval</div>;
                                                    default:
                                                        return null;
                                                }
                                            })()
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No data available</div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default BookingComponent
