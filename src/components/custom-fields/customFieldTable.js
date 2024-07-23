import React, { useMemo } from "react";
import { Table } from "antd";

const CustomFieldTable = ({ customFields }) => {
  const columns = useMemo(() => {
    return [
      {
        title: "Field Name",
        width: 100,
        dataIndex: "fieldName",
        key: "fieldName",
        fixed: "left",
      },
      {
        title: "Field Type",
        width: 100,
        dataIndex: "fieldType",
        key: "fieldType",
      },
      {
        title: "Required",
        dataIndex: "isRequired",
        key: "isRequired",
        width: 100,
        render: (isRequired) => (isRequired ? "Yes" : "No"),
      },
    ];
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={customFields.customFields}
      scroll={{
        x: 1500,
        y: 400,
      }}
      pagination={{ pageSize: 10}}
      bordered
    />
  );
};
export default CustomFieldTable;
