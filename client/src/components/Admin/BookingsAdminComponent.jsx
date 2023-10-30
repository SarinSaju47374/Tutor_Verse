function BookingsAdminComponent({ data }) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    function handleCancel(){
        
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
                            Cancel Requested
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
                                    <div className="Indicator">.</div>
                                </div>
                                <div className="td">
                                    <button>Approve</button>
                                    <button>Disapprove</button>
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

export default BookingsAdminComponent
