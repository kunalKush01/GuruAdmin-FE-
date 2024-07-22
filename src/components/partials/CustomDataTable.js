import React from "react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import "../../assets/scss/common.scss";

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
  masterListPagination,
  masterPagination,
}) {
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
          pagination={(masterPagination || masterListPagination) && true}
          // fixedHeader={masterPagination && true}
        />
      </DataTableWarraper>
    </>
  );
}

export default CustomDataTable;
