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
    border: 2px solid #ff8744;
    border-radius: 8px;
    .rdt_TableCell {
      color: #583703 !important;
      font: normal normal normal 13px/20px noto sans;
    }
    .rdt_TableHeadRow {
      border: 0px !important;
      .rdt_TableCol {
        color: #583703 !important;
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
    <>
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
        />
      </DataTableWrapper>
    </>
  );
}

export default CustomDharmshalaTable;
