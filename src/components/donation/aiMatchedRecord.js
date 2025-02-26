import React, { useEffect, useState } from "react";
import { Select, Table, Input } from "antd";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import { fetchFields } from "../../fetchModuleFields";
import { useSelector } from "react-redux";
import axios from "axios";
import { searchSupense } from "../../api/suspenseApi";

const { Option } = Select;
const { TextArea } = Input;

const AIMatchedRecord = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { t } = useTranslation();
  const trustId = localStorage.getItem("trustId");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [fieldOptions, setFieldOptions] = useState([]);

  useEffect(() => {
    const excludeFields = [
      "_id", "updatedAt", "updatedBy", "__v", "trustId",
      "receiptLink", "receiptName", "customFields", "user",
      "createdBy", "donorMapped", "transactionId", "isArticle",
      "isDeleted", "isGovernment", "donationType", "pgOrderId",
      "receiptNo", "billInvoice", "billInvoiceExpiredAt",
      "billInvoiceName", "supplyId", "itemId", "pricePerItem",
      "orderQuantity",
    ];
    const donation_excludeField = [
      "articleItem", "articleQuantity", "articleRemark",
      "articleType", "articleUnit", "articleWeight",
      "isArticle", "originalAmount",
    ];
    const finalExcludeFields = [...excludeFields, ...donation_excludeField];

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
  }, [trustId, selectedLang.id]);

  // API Call for fuzzy search
  const fetchSearchResults = async () => {
    if (!selectedField || !searchText.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchSupense({"query":searchText});
      console.log(response)
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Search API Error:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 500); // Debounce API call

    return () => clearTimeout(delayDebounce);
  }, [searchText, selectedField]);

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
      width: 150,
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      {/* First Row: Dropdown & TextArea */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Select
          placeholder="Select Field"
          style={{ width: "200px" }}
          onChange={(value) => setSelectedField(value)}
        >
          {fieldOptions.map((field) => (
            <Option key={field.value} value={field.value}>
              {field.label}
            </Option>
          ))}
        </Select>

        <TextArea
          placeholder="Type to search..."
          style={{ flex: 1 }}
          autoSize={{ minRows: 1, maxRows: 3 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Second Row: Table */}
      <Table
        className="commonListTable"
        columns={columns}
        dataSource={searchResults}
        pagination={false}
        scroll={{ x: 600, y: 140 }}
        bordered
      />
    </div>
  );
};

export default AIMatchedRecord;
