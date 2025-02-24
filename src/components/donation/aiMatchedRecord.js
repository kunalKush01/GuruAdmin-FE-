import React, { useEffect, useState } from "react";
import { Select, Button, Table } from "antd";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import { fetchFields } from "../../fetchModuleFields";
import { useSelector } from "react-redux";
const { Option } = Select;

const AIMatchedRecord = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { t } = useTranslation();
  // Dummy data for the table
  const data = [
    { key: "1", name: "John Doe", transactionId: "417912144296", amount: "$100" },
    { key: "2", name: "Jane Smith", transactionId: "TXN67890", amount: "$250" },
  ];

  const handleSearch = () => {
    // Simulating a search by filtering based on selectedValue
    if (selectedValue) {
      const filteredResults = data.filter((item) =>
        item.transactionId.includes(selectedValue)
      );
      setSearchResults(filteredResults);
    }
  };

  const columns = [
    {
      title: t("transactionDate"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY HH:mm") : "-"),
      width: 150,
      fixed: "left",
    },
    {
      title: t("bankNarration"),
      dataIndex: "bankNarration",
      key: "bankNarration",
      render: (text) => <div className="">{text}</div>,
      width: 400,
    },
    {
      title: t("suspense_amount"),
      dataIndex: "amount",
      key: "amount",
      width: 80,
    },
    {
      title: t("suspense_mode_of_payment"),
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      render: (text) =>
        text ? text : <span className="d-flex justify-content-center">-</span>,
      width: 150,
    },
    // {
    //   title: t("action"),
    //   key: "action",
    //   fixed: "right",
    //   width: 80,
    //   render: (text, record) => (
    //     <Space>
    //       <Tooltip title="Move to Donation">
    //         <img
    //           src={exchangeIcon}
    //           width={20}
    //           className="cursor-pointer"
    //           onClick={() => handleDonorMapped(record)}
    //         />
    //       </Tooltip>
    //       <img
    //         src={editIcon}
    //         width={35}
    //         className="cursor-pointer"
    //         onClick={() => handleEdit(record)}
    //       />
    //       <img
    //         src={deleteIcon}
    //         width={35}
    //         className="cursor-pointer"
    //         onClick={() => handleDelete(record)}
    //       />
    //     </Space>
    //   ),
    // },
  ];
  const trustId = localStorage.getItem("trustId");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    const donation_excludeField = [
      "articleItem",
      "articleQuantity",
      "articleRemark",
      "articleType",
      "articleUnit",
      "articleWeight",
      "isArticle",
      "originalAmount",
    ];
    const excludeFields = [
      "_id",
      "updatedAt",
      "updatedBy",
      // "createdAt",
      "__v",
      "trustId",
      "receiptLink",
      "receiptName",
      "customFields",
      "user",
      "createdBy",
      "donorMapped",
      "transactionId",
      "isArticle",
      "isDeleted",
      "isGovernment",
      "donationType",
      "pgOrderId",
      "receiptNo",
      "billInvoice",
      "billInvoiceExpiredAt",
      "billInvoiceName",
      "supplyId",
      "itemId",
      "pricePerItem",
      "orderQuantity",
    ];
    let finalExcludeFields = excludeFields;

    finalExcludeFields = [...excludeFields, ...donation_excludeField];

    const getFields = async () => {
      const options = await fetchFields(
        trustId,
        "Suspense",
        finalExcludeFields,
        selectedLang.id
      );
      setFieldOptions(options);
    };
    getFields();
  }, [trustId]);
  return (
    <div style={{ padding: "10px" }}>
      {/* First Row: Dropdown & Search Button */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Select
          placeholder="Select Transaction"
          style={{ width: "200px" }}
          onChange={(value) => setSelectedValue(value)}
        >
          {fieldOptions.map((field) => (
            <Option key={field.value} value={field.value}>
              {field.label}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Second Row: Table */}
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={searchResults}
        pagination={false}
        scroll={{ x: 600, y: 140 }}
        // sticky={{ offsetHeader: 64 }}
        bordered
      />
    </div>
  );
};

export default AIMatchedRecord;
