import React, { useMemo } from "react";
import { Table } from "antd";
import "../../assets/scss/common.scss";
import { useTranslation } from "react-i18next";
const CustomFieldTable = ({ customFields }) => {
  const { t } = useTranslation();
  const columns = useMemo(() => {
    return [
      {
        title: t("Field_Name"),
        width: 100,
        dataIndex: "fieldName",
        key: "fieldName",
        fixed: "left",
      },
      {
        title: t("Field_Type"),
        width: 100,
        dataIndex: "fieldType",
        key: "fieldType",
      },
      {
        title: t('Required'),
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
      pagination={{ pageSize: 10 }}
      bordered
      className="customFieldTable"
    />
  );
};
export default CustomFieldTable;
