import React, { useState } from "react";
import { Switch, Table } from "antd";
import "../../views/configuration/Masters/masterStyle.css";
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
      columns={columns}
      dataSource={data}
      scroll={{
        x: 1500,
        y: 400,
      }}
      sticky={{
        offsetHeader: 64,
      }}
      // pagination={{pageSize:10,showSizeChanger:true}}
      pagination={
        !masterPagination ? {
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total, // Ensure `pagination.total` is provided
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }:undefined
      }
      bordered
    />
  );
}

export default ANTDcustometable;
