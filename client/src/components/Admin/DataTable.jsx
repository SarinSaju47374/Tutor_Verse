import { useEffect,useMemo,useRef } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import "../../scss/components/Admin/DataTable.scss"
import GlobalFilter from "./GlobalFilter"
function DataTable({ columns, data, actions ,hiddenRows,modified}) {
    if (data) {
        columns = useMemo(() => columns, [])
        data =data.courses
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
        
        setTimeout(() => {
            const storedPageIndex = parseInt(localStorage.getItem("pageIndex"));
            // if (!isNaN(storedPageIndex)) {
            //     pageRef.current = storedPageIndex;
            // }
            // let page = Number(localStorage.getItem('pgIndex'))
         
            if(localStorage.getItem('pgIndex')){
                gotoPage(Number(localStorage.getItem('pgIndex')));    
            }
            if(localStorage.getItem('pgSize')){
                setPageSize(Number(localStorage.getItem('pgSize')))

            }
             
          
        }, 0);
      }, [pageIndex]);
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
                    {
                        page && page.map((row, index) => {
                            prepareRow(row)
                            const isHidden = hiddenRows.includes(row.original._id);
                              
                            return (
                                <tr {...row.getRowProps()} key={index}>
                                    {
                                        row.cells.map((cell, index) => {
                                            return (
                                                <td {...cell.getCellProps()} key={index}>
                                                    {/* Check if the cell value is an image URL */}
                                                    {cell.column.id === 'image' ? (
                                                        <img
                                                            src={cell.value}
                                                            alt="Image"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    ) : (
                                                        // If not, just render the cell value
                                                        cell.render('Cell')
                                                    )}
                                                    {/* {
                                                         cell.columns.id=='isHidden' ?{
                                                            row.original.isHidden? 'yes':no
                                                        }:null
                                                    } */}
                                                     {/* Render content based on column ID */}
                                                    {/*🧐🧐🧐🧐🧐*/}
                                                    {cell.column.id === 'isHidden' && (row.original.isHidden ? 'yes' : 'no')}
                                                    {cell.column.id === 'actions' ? (
                                                        actions.map((action, index) => {
                                                         
                                                            if (action.type === 'edit') {
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
                                                            } else if (action.type == 'hideunhide') {
                                                                return (<button key={index} onClick={() => action.handler(row.original._id)}>
                                                                    {(row.original.isHidden ?  <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>)}
                                                                    {/* {isHidden ? (
                                                                    <i className="fa-solid fa-eye"></i> // Show unhide icon
                                                                    ) : (
                                                                    <i className="fa-solid fa-eye-slash"></i> // Show hide icon
                                                                    )} */}
                                                                </button>)
                                                            }
                                                        })
                                                    ) : (
                                                        // If not, just render the cell value
                                                        null
                                                    )}
                                                </td>
                                            )
                                        })
                                    }

                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
            <div className="table-options">
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
            </div>
        </>
    )
}

export default DataTable
