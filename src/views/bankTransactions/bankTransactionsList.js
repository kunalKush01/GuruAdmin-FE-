import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { Children, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
const { RangePicker } = DatePicker;
import {
  Dropdown,
  Form,
  Space,
  Tabs,
  DatePicker,
  Input,
  Modal,
  Select,
  Tooltip,
  Radio,
} from "antd";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../api/categoryApi";
import { getAllDonation, importDonationFile } from "../../api/donationApi";
import { IMPORT, WRITE } from "../../utility/permissionsVariable";
import DonationANTDListTable from "../../components/donation/donationAntdListTable";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import filterIcon from "../../assets/images/icons/filter.svg";
import "../../assets/scss/viewCommon.scss";
import SuspenseListTable from "../../components/donation/suspenseListTable";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { addSuspense, getPossibleOrBestMatch } from "../../api/suspenseApi";
import loadingOutlined from "../../assets/images/icons/loadingIco.svg";
import syncIcon from "../../assets/images/icons/sync.svg";
import AddFilterSection from "../../components/partials/addFilterSection";
import FilterTag from "../../components/partials/filterTag";
import ImportHistoryTable from "../../components/donation/importHistoryTable";
import ScreenshotPanel from "../../components/donation/screenshotPanel";
import { useLocation } from "react-router-dom";
import ImportForm from "../donation/importForm";
import PossibleMatchedDrawer from "../donation/possibleMatchedDrawer";
import { getAllAccounts } from "../../api/profileApi";
const { TabPane } = Tabs;

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
export default function BankTransactionsList() {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [showScreenshotPanel, setShowScreenshotPanel] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const tabMapping = {
    Suspense: "suspense",
  };
  const [activeTab, setActiveTab] = useState("Suspense");
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get("type");
    const subTypeParam = searchParams.get("sub");
    const viewParam = searchParams.get("view");
    const recordId = searchParams.get("recordId");
    if (typeParam === "suspense") {
      setActiveTab("Suspense");
      setNestedActiveTab(subTypeParam || "unmatched");
    }

    setShowScreenshotPanel(viewParam === "true");

    if (viewParam === "true" && recordId) {
      const storedRecord = localStorage.getItem("viewRecord");
      if (storedRecord) {
        try {
          const parsedRecord = JSON.parse(storedRecord);
          if (parsedRecord._id === recordId) {
            setRecord(parsedRecord);
          }
        } catch (error) {
          console.error("Failed to parse stored record:", error);
        }
      }
    } else {
      // If view=false or missing, clear local storage
      localStorage.removeItem("viewRecord");
      setRecord(null);
    }
  }, [location.search]);

  const selectedLang = useSelector((state) => state.auth.selectLang);

  const [suspenseFilterData, setSuspenseFilterData] = useState({});

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    if (currentPage || currentCategory || currentFilter || currentSubCategory) {
      setCategoryTypeName(currentCategory);
      setSubCategoryTypeName(currentSubCategory);
      setdropDownName(currentFilter);
      setPagination((prev) => ({
        ...prev,
        page: parseInt(currentPage) || prev.page,
      }));
    }
  }, []);

  const categoryTypeQuery = useQuery(
    ["categoryTypes"],
    () =>
      getAllMasterCategories({
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );
  const categoryTypeItem = useMemo(
    () => categoryTypeQuery?.data?.results ?? [],
    [categoryTypeQuery]
  );
  const newTypes = [{ id: "", name: t("All") }, ...categoryTypeItem];

  let newId;
  newTypes.forEach((newObject) => {
    if (newObject.name == categoryTypeName) {
      newId = newObject.id;
    }
  });
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const { data } = useQuery(["Accounts"], () => getAllAccounts(), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching member data:", error);
    },
  });
  const extraAccountNames = ["Donation Income - Bank", "Uncategorised Bank"];

  const accountsItem = useMemo(() => {
    return (data?.result ?? []).filter(
      (account) =>
        account.isBankAccount || extraAccountNames.includes(account.name)
    );
  }, [data]);
  useEffect(() => {
    if (accountsItem.length && !selectedAccountId) {
      setSelectedAccountId(accountsItem[0].id); // Default to first item
    }
  }, [accountsItem]);

  const subCategoryTypeQuery = useQuery(
    ["subCategoryTypes", newId],
    () =>
      getAllCategories({
        masterId: newId,
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );
  const subCategoryTypeItem = useMemo(
    () => subCategoryTypeQuery?.data?.results ?? [],
    [subCategoryTypeQuery]
  );
  const subCategoryTypes = [{ id: "", name: t("All") }, ...subCategoryTypeItem];

  let subCategoryId;
  subCategoryTypes.forEach((subCategoryObject) => {
    if (subCategoryObject.name == subCategoryTypeName) {
      subCategoryId = subCategoryObject.id;
    }
  });

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const filteredData = useMemo(() => {
    // Select the filterData based on the active module (Donation or Suspense)
    const currentFilterData =
      activeTab === "Suspense" ? suspenseFilterData : {}; // If no active tab, use an empty object

    return Object.entries(currentFilterData).reduce((acc, [key, value]) => {
      const { index, label, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data without 'index'
      return acc;
    }, {});
  }, [suspenseFilterData, activeTab]);
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset page to 1 when changing tabs
    }));
  }, [activeTab]);

  const donationQuery = useQuery(
    [
      "donations",
      pagination.page,
      pagination.limit,
      selectedLang.id,
      newId,
      subCategoryId,
      searchBarValue,
      filteredData,
      activeTab,
    ],
    () =>
      getAllDonation({
        ...pagination,
        search: searchBarValue,
        // startDate: filterStartDate,
        masterId: newId,
        categoryId: subCategoryId,
        // endDate: filterEndDate,
        languageId: selectedLang.id,
        activeTab,
        ...(filteredData && { advancedSearch: filteredData }), // <-- only this line
      }),
    {
      keepPreviousData: true,
      enabled: activeTab === "Suspense",
    }
  );

  const donationItems = useMemo(
    () => donationQuery?.data?.results ?? [],
    [donationQuery]
  );

  const totalItems = donationQuery.data?.totalResults ?? 0;
  const totalPages = donationQuery.data?.totalPages ?? 1;
  const queryClient = useQueryClient();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importDonationFile(formData);
      queryClient.invalidateQueries("donations");
    }
  };

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "donation"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  const [showSuspenseHistory, setShowSuspenseHistory] = useState(false);

  const handleMenuSuspenseClick = (e) => {
    setShowSuspenseHistory(true);
  };
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleButtonClick = (e) => {
    showDrawer();
  };
  const [transactionType, setTransactionType] = useState("credit");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleAddSuspenseClick = () => {
    setIsAddModalVisible(true);
  };
  const [form] = Form.useForm();
  const handleFormSubmit = async (values) => {
    try {
      const formattedDate = moment(values.transactionDate).utc().format();

      const payload = {
        transactionDate: formattedDate,
        transactionId: values.transactionId || "",
        bankNarration: values.bankNarration || "",
        chequeNo: values.chequeNo || "",
        modeOfPayment: values.modeOfPayment || "",
        accountId: selectedAccountId || "",
        creditedAmount:
          transactionType === "credit" ? Number(values.amount) : null,
        debitedAmount:
          transactionType === "debit" ? Number(values.amount) : null,
      };

      await addSuspense(payload);

      queryClient.invalidateQueries("suspenseData");
      setSuccess(true);
      form.resetFields();
      setIsAddModalVisible(false);
    } catch (error) {
      setSuccess(false);
      console.error("Error adding suspense data:", error);
    }
  };
  const isFetchingSuspense = !showSuspenseHistory
    ? useIsFetching({ queryKey: ["suspenseData"] }) > 0
    : useIsFetching({ queryKey: ["suspenseDataHistory"] }) > 0;
  const handleRefresh = () => {
    !showSuspenseHistory
      ? queryClient.invalidateQueries(["suspenseData"])
      : queryClient.invalidateQueries(["suspenseDataHistory"]);
  };

  const modeOfPaymentOptions = [
    { value: "", label: t("select_option") },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "online", label: "Online" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];
  // State for managing filter modal for each tab

  const [suspenseFilterOpen, setSuspenseFilterOpen] = useState(false);
  const [fetchSuspenseField, setFetchSuspenseField] = useState(false);

  // Functions for Suspense tab
  const showSuspenseFilter = () => {
    setSuspenseFilterOpen(true);
    setFetchSuspenseField(true);
  };

  const onSuspenseFilterClose = () => {
    setSuspenseFilterOpen(false);
    setFetchSuspenseField(false);
  };

  const handleApplySuspenseFilter = () => {
    showSuspenseFilter();
  };

  const onSuspenseFilterSubmit = (filterData) => {
    setSuspenseFilterData(filterData);
  };

  const [suspenseRemovedData, setSuspenseRemovedData] = useState({});

  const suspenseRemoveAllFilter = () => {
    setSuspenseRemovedData(suspenseFilterData);
    setSuspenseFilterData({});
  };

  const [suspenseFilterRowId, setSuspenseFIlterRowId] = useState(null);

  const suspenseRemoveFilter = (fieldName, id) => {
    const updatedFilters = { ...suspenseFilterData };
    delete updatedFilters[fieldName];
    setSuspenseFilterData(updatedFilters);
    setSuspenseFIlterRowId(id);
  };

  // const hasFilters = Object.keys(filterData).length > 0;
  const hasFilters =
    activeTab === "Suspense"
      ? Object.keys(suspenseFilterData).length > 0
      : false;
  const [record, setRecord] = useState(null);

  //splits action buttons
  const [nestedActiveTab, setNestedActiveTab] = useState("unmatched");
  const renderActionButton = () => {
    switch (activeTab) {
      case "Suspense":
        return (
          <Space
            style={{
              display: nestedActiveTab !== "unmatched" ? "none" : "block",
            }}
          >
            {" "}
            <div className="d-flex justify-content-between align-items-center">
              {showSuspenseHistory ? (
                <img
                  src={arrowLeft}
                  className="me-2  cursor-pointer"
                  onClick={() => {
                    setShowSuspenseHistory(false);
                    queryClient.invalidateQueries("suspenseData");
                  }}
                />
              ) : (
                <div></div>
              )}
              <div className="d-flex flex-wrap gap-2 gap-md-0 justify-content-end">
                <Space className="me-2">
                  {isFetchingSuspense ? (
                    <img
                      src={loadingOutlined}
                      alt="Loading"
                      style={{ width: 24, height: 24, cursor: "pointer" }}
                      onClick={handleRefresh}
                    />
                  ) : (
                    <img
                      src={syncIcon}
                      alt="Loading"
                      style={{ width: 24, height: 24, cursor: "pointer" }}
                      onClick={handleRefresh}
                    />
                  )}
                </Space>
                <Space wrap className="">
                  <div style={{ width: "100%" }}>
                    <RangePicker
                      id="dateRangePickerANTD"
                      format="DD MMM YYYY"
                      placeholder={[t("Start Date"), t("End Date")]}
                      onChange={(dates) => {
                        if (dates && dates.length === 2) {
                          const [start, end] = dates;

                          setDateRangeFilter({
                            transactionDate: {
                              type: "inRange",
                              fromDate: start.startOf("day").toISOString(),
                              toDate: end.endOf("day").toISOString(),
                            },
                          });
                        } else {
                          setDateRangeFilter(null); // Reset if cleared
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <Tooltip title={t("Accounts")} color="#FF8744">
                    <div className="d-flex flex-column" id="accountsListDrop">
                      <Select
                        style={{ width: 210, height: "38px" }}
                        placeholder="Select Account"
                        onChange={(value) => {
                          setSelectedAccountId(value);
                        }}
                        value={selectedAccountId}
                      >
                        {accountsItem.map((account) => (
                          <Option key={account.id} value={account.id}>
                            {account.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Tooltip>
                  {!showSuspenseHistory &&
                    (allPermissions?.name === "all" ||
                      subPermission?.includes(WRITE)) && (
                      <Button
                        color="primary"
                        className="addAction-btn"
                        size="large"
                        onClick={handleAddSuspenseClick}
                      >
                        <span>
                          <Plus className="" size={15} strokeWidth={4} />
                        </span>
                        <span> {t("Add Bank Statement")}</span>
                      </Button>
                    )}
                  <Dropdown.Button
                    type="primary"
                    size="large"
                    className="dropDownBtn"
                    menu={{
                      items: [
                        {
                          label: t("history"),
                          key: "history",
                        },
                      ],
                      onClick: handleMenuSuspenseClick,
                    }}
                    onClick={handleButtonClick}
                  >
                    {t("import")}
                  </Dropdown.Button>
                  <ImportForm
                    onClose={onClose}
                    open={open}
                    tab={activeTab}
                    setShowSuspenseHistory={setShowSuspenseHistory}
                    selectedAccountId={
                      activeTab === "Suspense" ? selectedAccountId : undefined
                    }
                  />
                  <Button
                    className="secondaryAction-btn"
                    color="primary"
                    onClick={handleApplySuspenseFilter}
                  >
                    <img
                      src={filterIcon}
                      alt="Filter Icon"
                      width={20}
                      className="filterIcon"
                    />
                    {t("filter")}
                  </Button>
                </Space>
                <Modal
                  title={t("add_suspense_record")}
                  open={isAddModalVisible}
                  onCancel={() => setIsAddModalVisible(false)}
                  footer={null}
                  centered
                >
                  <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                  >
                    <Form.Item label={t("transaction_type")}>
                      <Radio.Group
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                      >
                        <Radio value="credit">{t("suspense_credit")}</Radio>
                        <Radio value="debit">{t("suspense_debit")}</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="transactionDate"
                          label={t("transactionDate")}
                          rules={[
                            {
                              required: true,
                              message: t("req_transactionDate"),
                            },
                          ]}
                        >
                          <CustomDatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            placeholder={t("select_date")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="transactionId"
                          label={t("suspense_transId")}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="bankNarration"
                          label={t("bankNarration")}
                          rules={[
                            { required: true, message: t("req_bankNarration") },
                          ]}
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="chequeNo"
                          label={t("suspense_cheque_no")}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="amount"
                          label={t("suspense_amount")}
                          rules={[
                            { required: true, message: t("req_ammount") },
                          ]}
                        >
                          <Input type="number" min="0" step="0.01" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="modeOfPayment"
                          label={t("suspense_mode_of_payment")}
                          rules={[
                            {
                              required: true,
                              message: t("req_modeofPayment"),
                            },
                          ]}
                        >
                          <Select>
                            {modeOfPaymentOptions.map((option) => (
                              <Select.Option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row justify="end">
                      <Col>
                        <Form.Item>
                          <Button color="primary" htmlType="submit">
                            {t("add_record")}
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Modal>
              </div>
            </div>
          </Space>
        );
    }
  };
  // Donation split tab
  const handleNestedTabChange = (nestedKey) => {
    setNestedActiveTab(nestedKey);
    if (activeTab === "Suspense") {
      history.push(`/bankTransactions?type=suspense&sub=${nestedKey}`);
    }
  };
  //**possible match logic */
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [isPossibleMatchedRecordDOpen, setIsPossibleMatchedRecordOpen] =
    useState(false);
  const handleDrawerOpen = () => setIsPossibleMatchedRecordOpen(true);
  const handleDrawerClose = () => setIsPossibleMatchedRecordOpen(false);
  const hasSelected = selectedRowKeys.length > 0;
  const { data: bestMatchesRecord, isLoading: isRecordLoading } = useQuery(
    ["matchedData", selectedRowKeys], // optional: track by selected keys
    () => getPossibleOrBestMatch({ suspenseIds: selectedRowKeys }),
    {
      enabled: isPossibleMatchedRecordDOpen && selectedRowKeys.length > 0,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  const matchedData = useMemo(
    () => bestMatchesRecord?.combinedMatch?.matchedWith ?? [],
    [bestMatchesRecord]
  );
  const items = [
    {
      key: "Suspense",
      label: t("Bank Transaction"),
      children: (
        <>
          <div className="d-flex justify-content-between">
            <FilterTag
              hasFilters={hasFilters}
              filterData={suspenseFilterData}
              removeFilter={suspenseRemoveFilter}
              handleRemoveAllFilter={suspenseRemoveAllFilter}
            />
          </div>
          <Tabs
            activeKey={nestedActiveTab}
            defaultActiveKey="unmatched"
            onChange={handleNestedTabChange} // Track nested tab changes
            tabBarExtraContent={
              nestedActiveTab === "unmatched" && (
                <Button
                  className="secondaryAction-btn"
                  style={{ marginBottom: "5px" }}
                  disabled={!hasSelected}
                  onClick={handleDrawerOpen}
                >
                  Get Matches
                </Button>
              )
            }
          >
            {/* First Tab - Unmatched Bank Credits */}
            <TabPane tab={t("Unmatched_Bank_Credits")} key="unmatched">
              <div className="donationContent">
                {!showSuspenseHistory ? (
                  <SuspenseListTable
                    setSelectedRowKeys={setSelectedRowKeys}
                    setSelectedRowsData={setSelectedRowsData}
                    selectedRowKeys={selectedRowKeys}
                    success={success}
                    filterData={{
                      ...filteredData,
                      ...(dateRangeFilter || {}),
                    }}
                    // filterData={filteredData}
                    type={activeTab}
                    accountId={selectedAccountId} // ✅ Pass the selected account ID
                    nestedActiveTab={nestedActiveTab}
                  />
                ) : (
                  <ImportHistoryTable tab={activeTab} />
                )}
              </div>

              <PossibleMatchedDrawer
                handleDrawerClose={handleDrawerClose}
                setIsPossibleMatchedRecordOpen={setIsPossibleMatchedRecordOpen}
                isDrawerOpen={isPossibleMatchedRecordDOpen}
                selectedRowKeys={selectedRowKeys}
                selectedRowsData={selectedRowsData}
                matchedData={matchedData}
              />
            </TabPane>
            <TabPane tab={t("Matched Transaction")} key="matched">
              <div className="donationContent">
                <SuspenseListTable
                  setSelectedRowKeys={setSelectedRowKeys}
                  setSelectedRowsData={setSelectedRowsData}
                  selectedRowKeys={selectedRowKeys}
                  success={success}
                  filterData={{
                    ...filteredData,
                    ...(dateRangeFilter || {}),
                  }}
                  // filterData={filteredData}
                  type={activeTab}
                  nestedActiveTab={nestedActiveTab}
                  accountId={selectedAccountId} // ✅ Pass the selected account ID
                />
              </div>
            </TabPane>
            {/* Second Tab - Pending Screenshots */}
            <TabPane tab={t("Pending_Screenshots")} key="pending">
              <div className="donationContent">
                {!showScreenshotPanel ? (
                  <DonationANTDListTable
                    donationType={activeTab}
                    data={donationItems}
                    allPermissions={allPermissions}
                    subPermission={subPermission}
                    totalItems={totalItems}
                    currentPage={pagination.page}
                    pageSize={pagination.limit}
                    onChangePage={(page) =>
                      setPagination((prev) => ({ ...prev, page }))
                    }
                    onChangePageSize={(pageSize) =>
                      setPagination((prev) => ({
                        ...prev,
                        limit: pageSize,
                        page: 1,
                      }))
                    }
                    setShowScreenshotPanel={setShowScreenshotPanel}
                    showScreenshotPanel={showScreenshotPanel}
                    setRecord={setRecord}
                  />
                ) : (
                  <ScreenshotPanel
                    record={record}
                    setRecord={setRecord}
                    setShowScreenshotPanel={setShowScreenshotPanel}
                    showScreenshotPanel={showScreenshotPanel}
                  />
                )}
              </div>
            </TabPane>
          </Tabs>

          <AddFilterSection
            onFilterClose={onSuspenseFilterClose}
            filterOpen={suspenseFilterOpen}
            onSubmitFilter={onSuspenseFilterSubmit}
            moduleName={activeTab}
            activeFilterData={suspenseFilterData ?? {}}
            rowId={suspenseFilterRowId ?? null}
            removedData={suspenseRemovedData}
            languageId={selectedLang.id}
            fetchField={fetchSuspenseField}
          />
        </>
      ),
    },
  ];
  const handleTabChange = (key) => {
    setActiveTab(key);
    const newType = tabMapping[key];

    if (newType) {
      if (newType === "Suspense") {
        history.push(
          `/bankTransactions?type=${newType}&sub=${nestedActiveTab}`
        );
      }
    }
  };

  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Donations</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <Tabs
          activeKey={activeTab}
          defaultActiveKey={activeTab}
          className="donationTab"
          items={items}
          onChange={handleTabChange}
          tabBarExtraContent={renderActionButton()}
        />
      </div>
    </div>
  );
}
