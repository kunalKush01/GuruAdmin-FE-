import React from "react";
import { Table } from "antd";
import "../../assets/scss/common.scss";
function ANTDcustometable({
  columns,
  data,
  pagination,
  onChangePage,
  onChangePageSize,
  masterPagination,
}) {
  return (
    <Table
      className="masterTable"
      columns={columns}
      dataSource={data}
      scroll={{
        x: 1500,
        y: 400,
      }}
      sticky={{
        offsetHeader: 64,
      }}
      pagination={
        !masterPagination
          ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: onChangePage,
              onShowSizeChange: (current, size) => onChangePageSize(size),
              showSizeChanger: true,
            }
          : undefined
      }
      bordered
    />
  );
}

export default ANTDcustometable;
