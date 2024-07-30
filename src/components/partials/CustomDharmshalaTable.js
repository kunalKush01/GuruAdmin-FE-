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

const DataTableWrapper = styled.div`
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
    ::-webkit-scrollbar-thumb {
      background-color: #c9c6c5 !important;
      border-radius: 25px;
      width: 10px !important;
    }
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 8px;
    .rdt_TableCell {
      color: #583703 !important;
      font: normal normal normal 13px/20px noto sans;
    }
    .rdt_TableHeadRow {
      border: 0px !important;
      background-color: #ff8744 !important;
      .rdt_TableCol {
        color: #ffffff !important;
        border: 0px !important;
        font: normal normal bold 14px/23px Noto Sans;
      }
    }
    .rdt_TableRow {
      color: #583703 !important;
      border: 0px !important;
      text-align: center !important;
    }
    .rdt_TableBody {
      max-height: 600px;
      height: 480px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: block;
      }
    }

    .pagination {
      display: flex;
      color: #ff8744;
      list-style-type: none;
      padding: 0;
      justify-content: center;
      margin-top: 20px;
    }

    .pagination li {
      margin: 0 5px;
      cursor: pointer;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .pagination li.active {
      background-color: #ff8744;
      color: #fff;
      border-color: #ff8744;
    }
  }
`;

function CustomDharmshalaTable({
  columns,
  data,
  selectableRowDisabled,
  selectableRowsHighlight,
  selectableRows,
  selectableRowSelected,
  onSelectedRowsChange,
  noDataComponent,
}) {
  return (
    <DataTableWrapper>
      <DataTable
        conditionalRowStyles={[conditionStyle]}
        className="DonetionList"
        columns={columns}
        noDataComponent={noDataComponent}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
        selectableRowDisabled={selectableRowDisabled}
        selectableRowsHighlight={selectableRowsHighlight}
        selectableRowSelected={selectableRowSelected}
        data={data}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
    </DataTableWrapper>
  );
}

export default CustomDharmshalaTable;
