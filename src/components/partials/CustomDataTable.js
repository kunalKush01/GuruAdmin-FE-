import React from "react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import "../../styles/common.scss";

const conditionStyle = {
  when: (row) => row.id % 2 !== 0,
  style: {
    backgroundColor: "#FFF7E8",
  },
};

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
}) {
  return (
    <div
      className="datatablewrapper"
      style={{
        minWidth: minWidth || "auto",
        maxHeight: maxHeight || "270px",
        height: height || "auto",
      }}
    >
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
    </div>
  );
}

export default CustomDataTable;
