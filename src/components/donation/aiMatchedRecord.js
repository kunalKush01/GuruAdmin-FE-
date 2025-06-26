import React, { useEffect, useState } from "react";
import { Select, Table, Input, Button, DatePicker, Space, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import linkIcon from "../../assets/images/icons/link.svg";
import { fetchFields } from "../../fetchModuleFields";
import { useSelector } from "react-redux";
import { searchSupense, syncSuspenseWithSearch } from "../../api/suspenseApi";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const AIMatchedRecord = ({ donationRecord }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { t } = useTranslation();
  const trustId = localStorage.getItem("trustId");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [activeTab, setActiveTab] = useState("Donation");

  const [selectedField, setSelectedField] = useState("bankNarration");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const excludeFields = [
      "_id",
      "updatedAt",
      "updatedBy",
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
      "createdAt",
      "donarName",
      "mobileNum",
      "userId",
      "modeOfPayment",
      "chequeNo",
    ];
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

  // API Call for fuzzy search (Triggered only by the search button)
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
      // await syncSuspenseWithSearch();
      let payload = {
        // field: selectedField,
        page: resetPage ? 1 : currentPage,
        limit: pageSize,
      };

      if (selectedField === "bankNarration") {
        payload.query = searchText;
        payload.field = selectedField;
      } else if (selectedField === "transactionDate") {
        payload.specificDate = moment(searchText, "YYYY-MM-DD").utc().format();
      } else if (selectedField === "amount") {
        payload.specificAmount = searchText;
      }
      // Search API Call
      const response = await searchSupense(payload);

      setSearchResults(response.result || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error syncing and searching:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [currentPage, pageSize]); // Fetch results on pagination change
  const handleDonorMapped = (record) => {
    const params = new URLSearchParams({
      page: pagination.page,
      category: categoryTypeName,
      subCategory: subCategoryTypeName,
      filter: dropDownName,
      type: activeTab,
      dateTime: record.transactionDate,
      remark: record.bankNarration,
      amount: record.amount,
      sId: record._id,
      donorMapped: record.donorMapped,
      modeOfPayment: record.modeOfPayment,
    }).toString();

    navigate({
      pathname: "/donation/edit",
      search: `?${params}`,
      state: {
        record: donationRecord,
        isEdit: true,
        isFieldDisable: true,
      },
    });
  };

  const columns = [
    {
      title: t("transactionDate"),
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => (text ? moment(text).format("DD-MMM-YYYY HH:mm") : "-"),
      width: 200,
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
      width: 100,
    },
    {
      title: t("suspense_mode_of_payment"),
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      render: (text) =>
        text ? text : <span className="d-flex justify-content-center">-</span>,
      width: 180,
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      width: 80,
      render: (text, record) => (
        <Space>
          {/* <Tooltip title=""> */}
          <img
            src={linkIcon}
            width={20}
            className="cursor-pointer"
            onClick={() => handleDonorMapped(record)}
          />
          {/* </Tooltip> */}
          {/* <img
            src={editIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          <img
            src={deleteIcon}
            width={35}
            className="cursor-pointer"
            onClick={() => handleDelete(record)}
          /> */}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      {/* First Row: Dropdown, TextArea, and Search Button */}
      <div
        style={{
          display: "flex",
          flexWrap: isMobile ? "wrap" : "",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <Select
          placeholder="Select Field"
          style={{ width: "200px" }}
          value={fieldOptions.length > 0 ? selectedField : undefined}
          onChange={(value) => {
            setSelectedField(value);
            setSearchText("");
          }}
          loading={fieldOptions.length === 0}
        >
          {fieldOptions.length > 0 ? (
            fieldOptions.map((field) => (
              <Option key={field.value} value={field.value}>
                {field.label}
              </Option>
            ))
          ) : (
            <Option value="" disabled>
              Loading...
            </Option>
          )}
        </Select>

        {/* Dynamic Input Field */}
        {selectedField === "bankNarration" && (
          <TextArea
            placeholder="Type to search..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}

        {selectedField === "transactionDate" && (
          <DatePicker
            className="suspenseDate"
            style={{ width: "200px" }}
            onChange={(date, dateString) => setSearchText(dateString)}
          />
        )}

        {selectedField === "amount" && (
          <Input
            style={{ flex: 1 }}
            type="number"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
        {/* <TextArea
          style={{ flex: 1 }}
          autoSize={{ minRows: 1, maxRows: 3 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        /> */}

        <Button
          type="primary"
          onClick={() => fetchSearchResults(true)}
          disabled={!selectedField || !searchText.trim()}
        >
          Search
        </Button>
      </div>

      {/* Second Row: Table */}
      <Table
        id="aiMatchTable"
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
        // scroll={{ x: 600, y: 140 }}
        bordered
      />
    </div>
  );
};

export default AIMatchedRecord;
