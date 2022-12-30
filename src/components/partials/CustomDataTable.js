import React from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";

const conditionStyle = {
  when: (row) => row.id % 2 !== 0,
  style: {
    backgroundColor: "#FFF7E8",
  },
};

function CustomDataTable({ columns, data, minWidth, maxHieght }) {
  const DataTableWarraper = styled.div`

  .DonetionList {
    //cursor: all-scroll;
    /* max-width: 70rem; */
    border: 2px solid #ff8744;
    /* overflow: auto; */
    border-radius: 10px;

    ::-webkit-scrollbar {
      display: none;
    }

    .rdt_TableCell {
      color: #583703 !important;
      font: normal normal normal 10px/23px Noto Sans;
      /* justify-content: center; */
    }

    .rdt_TableHeadRow {
          border: 0px !important;

        .rdt_TableCol {
          color: #583703 !important;
          border: 0px !important;
          font: normal normal bold 12px/23px Noto Sans;
          /* min-width: fit-content; */
          
        }
    }
    .rdt_TableRow {
      color: #583703 !important;
      border: 0px !important;
      text-align: center !important;
    }
    .rdt_TableBody {
      max-height: ${(props) => props.maxHieght ?? ""};
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    
  }
`;
  return (
    <DataTableWarraper minWidth={minWidth} maxHieght={maxHieght}>
      <DataTable
        conditionalRowStyles={[conditionStyle]}
        className="DonetionList"
        columns={columns}
        data={data}
      />
    </DataTableWarraper>
  );
}

export default CustomDataTable;
