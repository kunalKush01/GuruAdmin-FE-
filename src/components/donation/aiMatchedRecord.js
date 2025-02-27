import React, { useEffect, useState } from "react";
import { Select, Table, Input } from "antd";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import { fetchFields } from "../../fetchModuleFields";
import { useSelector } from "react-redux";
import { searchSupense, syncSuspenseWithSearch } from "../../api/suspenseApi";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const AIMatchedRecord = () => {
  const { t } = useTranslation();
  const trustId = localStorage.getItem("trustId");
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const [selectedField, setSelectedField] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const excludeFields = [
      "_id", "updatedAt", "updatedBy", "__v", "trustId", "receiptLink",
      "receiptName", "customFields", "user", "createdBy", "donorMapped",
      "transactionId", "isArticle", "isDeleted", "isGovernment", "donationType",
      "pgOrderId", "receiptNo", "billInvoice", "billInvoiceExpiredAt",
      "billInvoiceName", "supplyId", "itemId", "pricePerItem", "orderQuantity",
    ];
    const donation_excludeField = [
      "articleItem", "articleQuantity", "articleRemark", "articleType",
      "articleUnit", "articleWeight", "isArticle", "originalAmount",
    ];
    const finalExcludeFields = [...excludeFields, ...donation_excludeField];

    const getFields = async () => {
      const options = await fetchFields(
        trustId, "Suspense", finalExcludeFields, selectedLang.id
      );
      setFieldOptions(options);
    };
    getFields();
  }, [trustId, selectedLang.id]);

  // API Call for fuzzy search
  const fetchSearchResults = async (resetPage = false) => {
    if (!selectedField || !searchText.trim()) {
      setSearchResults([]);
      setTotalItems(0);
      return;
    }

    setLoading(true);
    try {
      if (resetPage) setCurrentPage(1); // Reset to first page on new search

      // Sync Suspense Data
      await syncSuspenseWithSearch();

      // Search API Call
      const response = await searchSupense({
        query: searchText,
        field: selectedField,
        page: resetPage ? 1 : currentPage,
        limit: pageSize,
      });

      setSearchResults(response.result || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error syncing and searching:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(true); // Reset to first page when changing search
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText, selectedField]);

  useEffect(() => {
    fetchSearchResults();
  }, [currentPage, pageSize]); // Fetch results on pagination change

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
      render: (text) =>
        text ? text : <span className="d-flex justify-content-center">-</span>,
      width: 120,
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
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        scroll={{ x: 600, y: 140 }}
        bordered
      />
    </div>
  );
};

export default AIMatchedRecord;
