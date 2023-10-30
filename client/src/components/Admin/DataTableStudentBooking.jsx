import { useEffect, useMemo, useRef, useState } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import "../../scss/components/Admin/DataTable.scss"
import GlobalFilter from "./GlobalFilter"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import axios from "../../axios"
import 'react-tooltip/dist/react-tooltip.css'
function DataTableStudentBooking({ columns, data, actions, hiddenRows, modified, download, setShow, show, setBookings }) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (data) {
        columns = useMemo(() => columns, [])
        data = data.booking
    }

    // const pageRef = useRef(1);
    //Creating a table Instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        prepareRow,
        state,
        setGlobalFilter,
        gotoPage,
        setPageSize,
        pageCount,
    } = useTable({
        columns,
        data
    }, useGlobalFilter, useSortBy, usePagination)
    const { globalFilter, pageIndex, pageSize } = state
    state.pageIndex = Number(localStorage.getItem('pgIndex'));

    async function handleViewBooking(id) {
        let response = await axios.get("/get-student-bookings", {
            params: { id: id }
        });
        setShow(!show)
        console.log(response.data)
        setBookings(response.data)
    }
    useEffect(() => {

        // setTimeout(() => {
        //     const storedPageIndex = parseInt(localStorage.getItem("pageIndex"));
        //     // if (!isNaN(storedPageIndex)) {
        //     //     pageRef.current = storedPageIndex;
        //     // }
        //     // let page = Number(localStorage.getItem('pgIndex'))

        //     if (localStorage.getItem('pgIndex')) {
        //         gotoPage(Number(localStorage.getItem('pgIndex')));
        //     }
        //     if (localStorage.getItem('pgSize')) {
        //         setPageSize(Number(localStorage.getItem('pgSize')))

        //     }


        // }, 0);
    }, [pageIndex]);
    console.log("😘", data)
    return (
        <>
            <GlobalFilter filter={state.globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map((headerGroup, index) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {
                                    headerGroup.headers.map((column, index) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index} style={{ textAlign: "center" }}>
                                            {column.render('Header')}
                                            <span style={{ marginLeft: "1 rem" }}>
                                                {column.isSorted ? (column.isSortedDesc ? '⏬' : '⏫') : ''}
                                            </span>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page &&
                        page.map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => (
                                        <td {...cell.getCellProps()} key={index} style={{ padding: "12px", fontSize: ".85rem" ,textAlign:"center"}}>

                                            {cell.render('Cell')}

                                            {
                                                cell.column.id === "isBlocked" && (row.original.isBlocked ? 'yes' : 'no')
                                            }
                                            {
                                                (cell.column.id === "start date" && (
                                                    row.original.startDate ?


                                                        new Date(row.original.startDate).toLocaleDateString(undefined, options)
                                                        :
                                                        "No Date Mentioned"

                                                ))
                                                
                                            }
                                            {
                                                (cell.column.id === "end date" && (
                                                    row.original.endDate ?


                                                        new Date(row.original.endDate).toLocaleDateString(undefined, options)
                                                        :
                                                        "No Date Mentioned"

                                                ))
                                                
                                            }
                                            {
                                                (cell.column.id === "cancel" && (
                                                    row.original.cancellationRequest.requestedByStudent                                                    ?
                                                         <div style={{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:"red",margin:"auto "}}>.</div>
                                                        :
                                                        null

                                                ))
                                                
                                            }
                                            {
                                                cell.column.id === "view" && (
                                                    <button style={{ backgroundColor: "aliceBlue", borderRadius: "8px" }} data-tooltip-id="view-sched" data-tooltip-content="View Bookings" onClick={() => handleViewBooking(row.original._id)}>
                                                        View
                                                        <ReactTooltip id="view-sched" />
                                                    </button>
                                                )
                                            }


                                            {/* {cell.column.id === 'actions' ? (
                                                actions.map((action, index) => {

                                                    if (action.type === 'block') {
                                                        return (<button
                                                            key={index}
                                                            onClick={() => action.handler(
                                                                row.original._id,
                                                            )}
                                                        >
                                                            {action.label}
                                                        </button>)
                                                    } else if (action.type == 'approve') {
                                                        return (<button key={index} onClick={() => action.handler(row.original._id)}>
                                                            {(row.original.isHidden ? (
                                                                <span>
                                                                    <i className="fa-solid fa-user-check" data-tooltip-id="approve" data-tooltip-content="Approve The user"></i>
                                                                    <ReactTooltip id="approve" />
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    <i className="fa-solid fa-user-times" data-tooltip-id="disapprove" data-tooltip-content="Disapprove The user"></i>
                                                                    <ReactTooltip id="disapprove" />
                                                                </span>
                                                            ))}

                                                        </button>)
                                                    }
                                                })
                                            ) : (
                                                // If not, just render the cell value
                                                null
                                            )} */}

                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            {/* <div className="table-options">
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                    {" "}
                </span>
                <span>
                    | Go to Page : {' '}
                    <input type="number" defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber)
                        }}
                        style={{ width: '50px' }}
                    />
                </span>
                <select name="" id="" onChange={e => {
                    localStorage.setItem("pgSize",Number(e.target.value))
                    setPageSize(Number(e.target.value))}}>
                    {   
                        <>
                         <option key="" value="" hidden>Page Size</option>
                        {
                            [2, 3, 4].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))
                        }
                        </>
                       
                    }
                </select>
                <button className="table-dir" onClick={() => {gotoPage(0)}} disabled={!canPreviousPage}>{'<<'}</button>
                <button onClick={() => {
                    
                    previousPage()
                    localStorage.setItem('pgIndex',pageIndex-1)
                    }} disabled={!canPreviousPage}> Previous</button>
                <button onClick={async() =>{ 
                   
                    nextPage()
                    localStorage.setItem('pgIndex',pageIndex+1)
                    }} disabled={!canNextPage}> Next</button>
                <button className="table-dir" onClick={() => {gotoPage(pageCount - 1)}} disabled={!canNextPage}>{'>>'}</button>
            </div> */}
        </>
    )
}

export default DataTableStudentBooking
