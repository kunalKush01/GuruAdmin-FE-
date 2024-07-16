import React, { useMemo } from "react";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getDonationCustomFields } from "../../api/customFieldsApi";
const CustomFieldTable = ({  }) => {
  const query = useQuery(
    ["getDonationFields"],
    () => getDonationCustomFields(),
    {
      keepPreviousData: true,
    }
  );

  const donation_custom_fields = useMemo(
    () => query?.data ?? [],
    [query]
  );

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
        render: (isRequired) => (isRequired ? "Yes" : "No"), // Render as "Yes" or "No"
      },
      // {
      //   title: "Action",
      //   key: "operation",
      //   fixed: "right",
      //   width: 100,
      //   render: () => <a>action</a>,
      // },
    ];
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={donation_custom_fields.customFields || []}
      scroll={{
        x: 1500,
        y: 400,
      }}
      bordered
    />
  );
};
export default CustomFieldTable;
