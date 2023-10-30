import { useEffect, useMemo, useRef } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import "../../scss/components/Admin/DataTable.scss"
import GlobalFilter from "./GlobalFilter"
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
function DataTableTutor({ columns, data, actions, hiddenRows, modified, download }) {
    if (data) {
        columns = useMemo(() => columns, [])
        data = data.tutors
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
    console.log(data)
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
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
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
                                        <td {...cell.getCellProps()} key={index}>

                                            {cell.render('Cell')}
                                            {
                                                cell.column.id === "profileCompleted" && (row.original.profileCompleted ? 'yes' : 'no')
                                            }
                                            {
                                                cell.column.id === "isBlocked" && (row.original.isBlocked ? 'yes' : 'no')
                                            }
                                            {
                                                cell.column.id === "view" && (
                                                    <button style={{ backgroundColor: "aliceBlue", borderRadius: "8px" }} data-tooltip-id="view-sched" data-tooltip-content="View The Schedule">
                                                        Check
                                                        <ReactTooltip id="view-sched" />
                                                    </button>
                                                )
                                            }
                                            {
                                                cell.column.id === "download" && (
                                                    row.original.documents.length > 0 ?
                                                        <span data-tooltip-id="download" data-tooltip-content="Download all the Files" >
                                                            <i className="fa-solid fa-download" style={{ cursor: "pointer" }} onClick={() => download.handler(row)}></i>
                                                            <ReactTooltip id="download" />
                                                        </span>
                                                        :
                                                        "No Files Submitted"
                                                )
                                            }
                                            {
                                                (cell.column.id === "image" && (
                                                    row.original.profilePhoto ?


                                                        <img
                                                            src={row.original.profilePhoto}
                                                            alt="Profile"
                                                            style={{ width: '50px', height: '50px', objectFit: "cover" }}
                                                        />
                                                        :
                                                        "No Profile"

                                                ))
                                            }
                                            {cell.column.id === 'actions' ? (
                                                actions.map((action, index) => {

                                                    if (action.type === 'block') {
                                                        return (<button
                                                            key={index}
                                                            onClick={() => action.handler(
                                                                row.original._id,
                                                                row.original.courseName,
                                                                row.original.grade,
                                                                row.original.board,
                                                                row.original.price,
                                                                row.original.duration,
                                                                row.original.desc,
                                                                row.original.image,
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
                                            )}

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

export default DataTableTutor
