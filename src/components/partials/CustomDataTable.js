import React from "react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import styled from "styled-components";
const conditionStyle = {
  when: (row) => row.id % 2 !== 0,
  style: {
    backgroundColor: "#FFF7E8",
  },
};

const DataTableWarraper = styled.div`
  .data-table-extensions-filter {
    display: none !important;
  }

  .download {
    color: red !important;
  }
  .DonetionList {
    ::-webkit-scrollbar {
      height: 8px;
    }
    /* ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  } */
    ::-webkit-scrollbar-thumb {
      background-color: #c9c6c5 !important;
      border-radius: 25px;
      width: 10px !important;
    }
    //cursor: all-scroll;
    /* max-width: 70rem; */
    border: 2px solid #ff8744;
    /* overflow: auto; */
    border-radius: 8px;
    .rdt_TableCell {
      color: #583703 !important;
      font: normal normal normal 13px/20px noto sans;
      /* justify-content: center; */
    }
    ::-webkit-scrollbar {
        display: none;
      }
    .rdt_TableHeadRow {
      border: 0px !important;
      .rdt_TableCol {
        color: #583703 !important;
        border: 0px !important;
        font: normal normal bold 14px/23px Noto Sans;
        /* min-width: fit-content; */
      }
    }
    .rdt_TableRow {
      color: #583703 !important;
      border: 0px !important;
      text-align: center !important;
    }
    .rdt_TableBody {
      max-height: ${(props) => props.maxHeight ?? ""};
      height: ${(props) => props.height ?? ""};
      ${"" /* overflow: auto; */}
      ::-webkit-scrollbar {
        display: block;
      }
    }
  }
`;

function CustomDataTable({
  columns,
  data,
  minWidth,
  maxHeight,
  selectableRowDisabled,
  selectableRowsHighlight,
  selectableRows,
  selectableRowSelected,
  onSelectedRowsChange,
  noDataComponent,
  height,
  masterPagination,
}) {
  // const tableData = {
  //     columns,
  //     data
  //   }

  return (
    <>
      <DataTableWarraper
        minWidth={minWidth}
        maxHeight={maxHeight ? "100%" : "400px"}
        height={height}
      >
        <DataTable
          conditionalRowStyles={[conditionStyle]}
          className="DonetionList"
          columns={columns}
          noDataComponent={noDataComponent}
          selectableRows={selectableRows}
          onSelectedRowsChange={onSelectedRowsChange}
          selectableRowDisabled={selectableRowDisabled}
          selectableRowsHighlight={selectableRowsHighlight} // highlight selected rows
          selectableRowSelected={selectableRowSelected}
          data={data}
          pagination={masterPagination && true}
          // fixedHeader={masterPagination && true}
        />
      </DataTableWarraper>
    </>
  );
}

export default CustomDataTable;
