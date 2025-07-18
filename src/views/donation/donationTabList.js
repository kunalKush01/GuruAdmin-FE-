import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { Children, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Tag,
  Tooltip,
  Radio,
} from "antd";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../api/categoryApi";
import { getAllDonation, importDonationFile } from "../../api/donationApi";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { ConverFirstLatterToCapital } from "../../utility/formater";
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
import ImportForm from "./importForm";
import ImportHistoryTable from "../../components/donation/importHistoryTable";
import ScreenshotPanel from "../../components/donation/screenshotPanel";
import { useLocation } from "react-router-dom";
import { getAllAccounts } from "../../api/profileApi";
import PossibleMatchedDrawer from "./possibleMatchedDrawer";
const { TabPane } = Tabs;

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
export default function Donation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const importFileRef = useRef();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const donation_type = searchParams.get("type");
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [showScreenshotPanel, setShowScreenshotPanel] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState(null);

  const tabMapping = {
    Donation: "", // No query param for Donation
    Article_Donation: "article-donation",
    Suspense: "suspense",
  };
  const [activeTab, setActiveTab] = useState(
    donation_type ? donation_type : "Donation"
  );
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get("type");
    const subTypeParam = searchParams.get("sub");
    const viewParam = searchParams.get("view");
    const recordId = searchParams.get("recordId");

    if (typeParam === "suspense") {
      setActiveTab("Suspense");
      setNestedActiveTab(subTypeParam || "unmatched");
    } else if (typeParam === "article-donation") {
      setActiveTab("Article_Donation");
    } else {
      setActiveTab("Donation");
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

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const typeParam = searchParams.get("type");
  //   const subTypeParam = searchParams.get("sub");
  //   const viewParam = searchParams.get("view");

  //   if (typeParam === "suspense") {
  //     setActiveTab("Suspense");
  //     setNestedActiveTab(subTypeParam || "unmatched"); // Default to "unmatched" if no sub-type
  //   } else if (typeParam === "article-donation") {
  //     setActiveTab("Article_Donation");
  //   } else {
  //     setActiveTab("Donation");
  //   }
  //   setShowScreenshotPanel(viewParam === "true");
  // }, [location.search]);

  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [donationFilterData, setDonationFilterData] = useState({});
  const [articleDonationFilterData, setArticleDonationFilterData] = useState(
    {}
  );
  const [suspenseFilterData, setSuspenseFilterData] = useState({});

  const periodDropDown = () => {
    switch (dropDownName) {
      case "dashboard_monthly":
        return "month";
      case "dashboard_yearly":
        return "year";
      case "dashboard_weekly":
        return "week";

      default:
        return "month";
    }
  };
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

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

  const [categoryId, setCategoryId] = useState();

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
  const [subCategoryTypeId, setSubCategoryTypeId] = useState();

  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  // const filteredData = useMemo(() => {
  //   return Object.entries(filterData).reduce((acc, [key, value]) => {
  //     const { index, ...rest } = value; // Destructure and exclude 'index'
  //     acc[key] = rest; // Add the remaining data
  //     return acc;
  //   }, {});
  // }, [filterData]);
  const filteredData = useMemo(() => {
    // Select the filterData based on the active module (Donation or Suspense)
    const currentFilterData =
      activeTab === "Donation"
        ? donationFilterData
        : activeTab === "Article_Donation"
        ? articleDonationFilterData
        : activeTab === "Suspense"
        ? suspenseFilterData
        : {}; // If no active tab, use an empty object

    return Object.entries(currentFilterData).reduce((acc, [key, value]) => {
      const { index, label, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data without 'index'
      return acc;
    }, {});
  }, [
    donationFilterData,
    articleDonationFilterData,
    suspenseFilterData,
    activeTab,
  ]);
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
      // filterEndDate,
      // filterStartDate,
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
        ...((donationFilterData || articleDonationFilterData) &&
          filteredData && { advancedSearch: filteredData }),
      }),
    {
      keepPreviousData: true,
      enabled:
        activeTab === "Donation" ||
        activeTab === "Article_Donation" ||
        activeTab === "Suspense",
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
  const [showDonationHistory, setShowDonationHistory] = useState(false);
  const [showSuspenseHistory, setShowSuspenseHistory] = useState(false);
  const handleMenuDonationClick = (e) => {
    setShowDonationHistory(true);
  };
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
  const handleDonationRefresh = () => {
    !showDonationHistory
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
  const [donationFilterOpen, setDonationFilterOpen] = useState(false);
  const [articleDonationFilterOpen, setArticleDonationFilterOpen] =
    useState(false);
  const [suspenseFilterOpen, setSuspenseFilterOpen] = useState(false);
  const [fetchDonationField, setFetchDonationField] = useState(false);
  const [fetchArticleDonationField, setFetchArticleDonationField] =
    useState(false);
  const [fetchSuspenseField, setFetchSuspenseField] = useState(false);
  // Functions for Donation tab
  const showDonationFilter = () => {
    setDonationFilterOpen(true);
    setFetchDonationField(true);
  };

  const onDonationFilterClose = () => {
    setDonationFilterOpen(false);
    setFetchDonationField(false);
  };

  const handleApplyDonationFilter = () => {
    showDonationFilter();
  };

  // Functions for Article Donation tab
  const showArticleDonationFilter = () => {
    setArticleDonationFilterOpen(true);
    setFetchArticleDonationField(true);
  };

  const onArticleDonationFilterClose = () => {
    setArticleDonationFilterOpen(false);
    setFetchArticleDonationField(false);
  };

  const handleApplyArticleDonationFilter = () => {
    showArticleDonationFilter();
  };

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

  const onDonationFilterSubmit = (filterData) => {
    setDonationFilterData(filterData);
  };
  const onArticleDonationFilterSubmit = (filterData) => {
    setArticleDonationFilterData(filterData);
  };
  const onSuspenseFilterSubmit = (filterData) => {
    setSuspenseFilterData(filterData);
  };

  const [donationRemovedData, setDonationRemovedData] = useState({});
  const [articleDonationemovedData, setArticleDonationemovedData] = useState(
    {}
  );
  const [suspenseRemovedData, setSuspenseRemovedData] = useState({});
  const donationRemoveAllFilter = () => {
    setDonationRemovedData(donationFilterData);
    setDonationFilterData({});
  };
  const articleDonationRemoveAllFilter = () => {
    setArticleDonationemovedData(articleDonationFilterData);
    setArticleDonationFilterData({});
  };
  const suspenseRemoveAllFilter = () => {
    setSuspenseRemovedData(suspenseFilterData);
    setSuspenseFilterData({});
  };
  const [donantionFilterRowId, setDonantionFilterRowId] = useState(null);
  const [articleDonantionFilterRowId, setArticleDonantionFilterRowId] =
    useState(null);
  const [suspenseFilterRowId, setSuspenseFIlterRowId] = useState(null);

  const donationRemoveFilter = (fieldName, id) => {
    const updatedFilters = { ...donationFilterData };
    delete updatedFilters[fieldName];
    setDonationFilterData(updatedFilters);
    setDonantionFilterRowId(id);
  };
  const articleDonationRemoveFilter = (fieldName, id) => {
    const updatedFilters = { ...articleDonationFilterData };
    delete updatedFilters[fieldName];
    setArticleDonationFilterData(updatedFilters);
    setArticleDonantionFilterRowId(id);
  };
  const suspenseRemoveFilter = (fieldName, id) => {
    const updatedFilters = { ...suspenseFilterData };
    delete updatedFilters[fieldName];
    setSuspenseFilterData(updatedFilters);
    setSuspenseFIlterRowId(id);
  };

  // const hasFilters = Object.keys(filterData).length > 0;
  const hasFilters =
    activeTab === "Donation"
      ? Object.keys(donationFilterData).length > 0
      : activeTab === "Article_Donation"
      ? Object.keys(articleDonationFilterData).length > 0
      : activeTab === "Suspense"
      ? Object.keys(suspenseFilterData).length > 0
      : false;
  const [record, setRecord] = useState(null);

  //splits action buttons
  const [nestedActiveTab, setNestedActiveTab] = useState("unmatched");
  const renderActionButton = () => {
    switch (activeTab) {
      case "Donation":
        return (
          <Space>
            <div
              className="d-flex justify-content-between align-items-center"
              id="donation_view_btn"
            >
              {showDonationHistory ? (
                <img
                  src={arrowLeft}
                  className="me-2  cursor-pointer"
                  onClick={() => {
                    setShowDonationHistory(false);
                    queryClient.invalidateQueries("donations");
                  }}
                />
              ) : (
                <div></div>
              )}
              <div className="botton-container align-items-center">
                <Space className="me-2">
                  {showDonationHistory ? (
                    <img
                      src={syncIcon}
                      alt="Loading"
                      style={{ width: 24, height: 24, cursor: "pointer" }}
                      onClick={handleDonationRefresh}
                    />
                  ) : (
                    <div></div>
                  )}
                </Space>
                <div className="d-flex row1 me-1">
                  <Tooltip title={t("category")} color="#FF8744">
                    <ChangeCategoryType
                      className={"me-1"}
                      categoryTypeArray={newTypes}
                      typeName={ConverFirstLatterToCapital(
                        categoryTypeName ?? ""
                      )}
                      setTypeName={(e) => {
                        setCategoryId(e.target.id);
                        setCategoryTypeName(e.target.name);
                        setPagination({ page: 1 });
                        navigate(
                          `/donation?page=${1}&category=${
                            e.target.name
                          }&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                        );
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t("categories_sub_category")} color="#FF8744">
                    <ChangeCategoryType
                      // className={"me-1"}
                      categoryTypeArray={subCategoryTypes}
                      typeName={ConverFirstLatterToCapital(
                        subCategoryTypeName ?? ""
                      )}
                      setTypeName={(e) => {
                        setSubCategoryTypeId(e.target.id);
                        setSubCategoryTypeName(e.target.name);
                        setPagination({ page: 1 });
                        navigate(
                          `/donation?page=${1}&category=${categoryTypeName}&subCategory=${
                            e.target.name
                          }&filter=${dropDownName}`
                        );
                      }}
                    />
                  </Tooltip>
                  {/* <ChangePeriodDropDown
                  dropDownName={dropDownName}
                  setdropDownName={(e) => {
                    setdropDownName(e.target.name);
                    setPagination({ page: 1 });
                    navigate(
                      `/donation?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${
                        e.target.name
                      }`
                    );
                  }}
                /> */}
                </div>
                <Space wrap className="row2">
                  {/* <Button
                  className={`secondaryAction-btn me-1`}
                  color="primary"
                  onClick={handleButtonClick}
                  // onClick={() => importFileRef.current.click()}
                >
                  {t("Import_File")}
                </Button> */}
                  {allPermissions?.name === "all" ||
                  subPermission?.includes(WRITE) ? (
                    <Button
                      color="primary"
                      className={`addAction-btn`}
                      onClick={() =>
                        navigate({
                          pathname: "/donation/add",
                          search: `?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}&type=${activeTab}`,
                          state: { record: {}, isEdit: false },
                        })
                      }
                    >
                      <span>
                        <Plus className="" size={15} strokeWidth={4} />
                      </span>
                      <span>
                        <Trans i18nKey={"donation_Adddonation"} />
                      </span>
                    </Button>
                  ) : (
                    ""
                  )}
                  {allPermissions?.name === "all" ||
                  subPermission?.includes(IMPORT) ? (
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
                        onClick: handleMenuDonationClick,
                      }}
                      onClick={handleButtonClick}
                    >
                      {t("import")}
                    </Dropdown.Button>
                  ) : (
                    ""
                  )}
                  <ImportForm
                    onClose={onClose}
                    open={open}
                    tab={activeTab}
                    setShowDonationHistory={setShowDonationHistory}
                  />
                  <input
                    type="file"
                    ref={importFileRef}
                    accept=""
                    className="d-none"
                    onChange={handleImportFile}
                  />
                </Space>
                <Button
                  className="secondaryAction-btn"
                  color="primary"
                  onClick={handleApplyDonationFilter}
                >
                  <img
                    src={filterIcon}
                    alt="Filter Icon"
                    width={20}
                    className="filterIcon"
                  />
                  {t("filter")}
                </Button>
              </div>
            </div>
          </Space>
        );
      case "Article_Donation":
        return (
          <Space>
            {" "}
            <div
              className="d-flex flex-wrap gap-2 gap-md-0 justify-content-end"
              id="donation_view_btn"
            >
              <div className="botton-container align-items-center">
                <div className="d-flex row1">
                  <Tooltip title={t("category")} color="#FF8744">
                    <ChangeCategoryType
                      className={"me-1"}
                      categoryTypeArray={newTypes}
                      typeName={ConverFirstLatterToCapital(
                        categoryTypeName ?? ""
                      )}
                      setTypeName={(e) => {
                        setCategoryId(e.target.id);
                        setCategoryTypeName(e.target.name);
                        setPagination({ page: 1 });
                        navigate(
                          `/donation?page=${1}&category=${
                            e.target.name
                          }&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                        );
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t("categories_sub_category")} color="#FF8744">
                    <ChangeCategoryType
                      className={"me-1"}
                      categoryTypeArray={subCategoryTypes}
                      typeName={ConverFirstLatterToCapital(
                        subCategoryTypeName ?? ""
                      )}
                      setTypeName={(e) => {
                        setSubCategoryTypeId(e.target.id);
                        setSubCategoryTypeName(e.target.name);
                        setPagination({ page: 1 });
                        navigate(
                          `/donation?page=${1}&category=${categoryTypeName}&subCategory=${
                            e.target.name
                          }&filter=${dropDownName}`
                        );
                      }}
                    />
                  </Tooltip>
                  <ChangePeriodDropDown
                    className="me-1 donationFilterBtn"
                    dropDownName={dropDownName}
                    setdropDownName={(e) => {
                      setdropDownName(e.target.name);
                      setPagination({ page: 1 });
                      navigate(
                        `/donation?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${
                          e.target.name
                        }`
                      );
                    }}
                  />
                </div>
                <div className="row2">
                  {allPermissions?.name === "all" ||
                  subPermission?.includes(WRITE) ? (
                    <Button
                      color="primary"
                      className={`addAction-btn me-1`}
                      onClick={() =>
                        navigate(
                          `/donation/add?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}&type=${activeTab}`
                        )
                      }
                    >
                      <span>
                        <Plus className="" size={15} strokeWidth={4} />
                      </span>
                      <span>
                        <Trans i18nKey={"donation_AddArticledonation"} />
                      </span>
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
                <Button
                  className="secondaryAction-btn"
                  style={{ marginBottom: "2px" }}
                  color="primary"
                  onClick={handleApplyArticleDonationFilter}
                >
                  <img
                    src={filterIcon}
                    alt="Filter Icon"
                    width={20}
                    className="filterIcon"
                  />
                  {t("filter")}
                </Button>
              </div>
            </div>
          </Space>
        );
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
                        <span> {t("add_suspense_record")}</span>
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
      navigate(`/donation?type=suspense&sub=${nestedKey}`);
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
      key: "Donation",
      label: t("donation"),
      children: (
        <>
          <div className="d-flex justify-content-between">
            <FilterTag
              hasFilters={hasFilters}
              filterData={donationFilterData}
              removeFilter={donationRemoveFilter}
              handleRemoveAllFilter={donationRemoveAllFilter}
            />
          </div>

          <div style={{ height: "10px" }}>
            <If condition={donationQuery.isFetching}>
              <Then>
                <Skeleton
                  baseColor="#ff8744"
                  highlightColor="#fff"
                  height={"3px"}
                />
              </Then>
            </If>
          </div>
          <div className="donationContent">
            <Row>
              <If condition={donationQuery.isLoading} disableMemo>
                <Then>
                  <SkeletonTheme
                    baseColor="#FFF7E8"
                    highlightColor="#fff"
                    borderRadius={"10px"}
                  >
                    <Col>
                      <Skeleton height={"335px"} width={"100%"} />
                    </Col>
                  </SkeletonTheme>
                </Then>
                <Else>
                  <If condition={donationItems.length != 0} disableMemo>
                    <Then>
                      {!showDonationHistory ? (
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
                        />
                      ) : (
                        <ImportHistoryTable tab={activeTab} />
                      )}
                    </Then>
                    <Else>
                      <NoContent
                        headingNotfound={t("donation_not_found")}
                        para={t("donation_not_click_add_donation")}
                      />
                    </Else>
                  </If>
                </Else>
              </If>
            </Row>
          </div>
          <AddFilterSection
            onFilterClose={onDonationFilterClose}
            filterOpen={donationFilterOpen}
            onSubmitFilter={onDonationFilterSubmit}
            moduleName={activeTab}
            activeFilterData={donationFilterData ?? {}}
            rowId={donantionFilterRowId ?? null}
            removedData={donationRemovedData}
            languageId={selectedLang.id}
            fetchField={fetchDonationField}
          />
        </>
      ),
    },
    {
      key: "Article_Donation",
      label: t("article_donation"),
      children: (
        <>
          <div className="d-flex justify-content-between">
            <FilterTag
              hasFilters={hasFilters}
              filterData={articleDonationFilterData}
              removeFilter={articleDonationRemoveFilter}
              handleRemoveAllFilter={articleDonationRemoveAllFilter}
            />
          </div>
          <div style={{ height: "10px" }}>
            <If condition={donationQuery.isFetching}>
              <Then>
                <Skeleton
                  baseColor="#ff8744"
                  highlightColor="#fff"
                  height={"3px"}
                />
              </Then>
            </If>
          </div>
          <div className="donationContent">
            <Row>
              <If condition={donationQuery.isLoading} disableMemo>
                <Then>
                  <SkeletonTheme
                    baseColor="#FFF7E8"
                    highlightColor="#fff"
                    borderRadius={"10px"}
                  >
                    <Col>
                      <Skeleton height={"335px"} width={"100%"} />
                    </Col>
                  </SkeletonTheme>
                </Then>
                <Else>
                  <If condition={donationItems.length != 0} disableMemo>
                    <Then>
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
                      />
                    </Then>
                    <Else>
                      <NoContent
                        headingNotfound={t("donation_not_found")}
                        para={t("donation_not_click_add_donation")}
                      />
                    </Else>
                  </If>
                </Else>
              </If>
            </Row>
          </div>
          <AddFilterSection
            onFilterClose={onArticleDonationFilterClose}
            filterOpen={articleDonationFilterOpen}
            onSubmitFilter={onArticleDonationFilterSubmit}
            moduleName={activeTab}
            activeFilterData={articleDonationFilterData ?? {}}
            rowId={articleDonantionFilterRowId ?? null}
            removedData={articleDonationemovedData}
            languageId={selectedLang.id}
            fetchField={fetchArticleDonationField}
          />
        </>
      ),
    },
    // {
    //   key: "Suspense",
    //   label: t("suspense"),
    //   children: (
    //     <>
    //       <div className="d-flex justify-content-between">
    //         <FilterTag
    //           hasFilters={hasFilters}
    //           filterData={suspenseFilterData}
    //           removeFilter={suspenseRemoveFilter}
    //           handleRemoveAllFilter={suspenseRemoveAllFilter}
    //         />
    //       </div>
    //       <Tabs
    //         activeKey={nestedActiveTab}
    //         defaultActiveKey="unmatched"
    //         onChange={handleNestedTabChange} // Track nested tab changes
    //         tabBarExtraContent={
    //           nestedActiveTab === "unmatched" && (
    //             <Button
    //               className="secondaryAction-btn"
    //               style={{ marginBottom: "5px" }}
    //               disabled={!hasSelected}
    //               onClick={handleDrawerOpen}
    //             >
    //               Get Matches
    //             </Button>
    //           )
    //         }
    //       >
    //         {/* First Tab - Unmatched Bank Credits */}
    //         <TabPane tab={t("Unmatched_Bank_Credits")} key="unmatched">
    //           <div className="donationContent">
    //             {!showSuspenseHistory ? (
    //               <SuspenseListTable
    //                 setSelectedRowKeys={setSelectedRowKeys}
    //                 setSelectedRowsData={setSelectedRowsData}
    //                 selectedRowKeys={selectedRowKeys}
    //                 success={success}
    //                 filterData={{
    //                   ...filteredData,
    //                   ...(dateRangeFilter || {}),
    //                 }}
    //                 // filterData={filteredData}
    //                 type={activeTab}
    //                 accountId={selectedAccountId} // ✅ Pass the selected account ID
    //                 nestedActiveTab={nestedActiveTab}
    //               />
    //             ) : (
    //               <ImportHistoryTable tab={activeTab} />
    //             )}
    //           </div>

    //           <PossibleMatchedDrawer
    //             handleDrawerClose={handleDrawerClose}
    //             setIsPossibleMatchedRecordOpen={setIsPossibleMatchedRecordOpen}
    //             isDrawerOpen={isPossibleMatchedRecordDOpen}
    //             selectedRowKeys={selectedRowKeys}
    //             selectedRowsData={selectedRowsData}
    //             matchedData={matchedData}
    //           />
    //         </TabPane>
    //         <TabPane tab={t("Matched Transaction")} key="matched">
    //           <div className="donationContent">
    //             <SuspenseListTable
    //               setSelectedRowKeys={setSelectedRowKeys}
    //               setSelectedRowsData={setSelectedRowsData}
    //               selectedRowKeys={selectedRowKeys}
    //               success={success}
    //               filterData={{
    //                 ...filteredData,
    //                 ...(dateRangeFilter || {}),
    //               }}
    //               // filterData={filteredData}
    //               type={activeTab}
    //               nestedActiveTab={nestedActiveTab}
    //               accountId={selectedAccountId} // ✅ Pass the selected account ID
    //             />
    //           </div>
    //         </TabPane>
    //         {/* Second Tab - Pending Screenshots */}
    //         <TabPane tab={t("Pending_Screenshots")} key="pending">
    //           <div className="donationContent">
    //             {!showScreenshotPanel ? (
    //               <DonationANTDListTable
    //                 donationType={activeTab}
    //                 data={donationItems}
    //                 allPermissions={allPermissions}
    //                 subPermission={subPermission}
    //                 totalItems={totalItems}
    //                 currentPage={pagination.page}
    //                 pageSize={pagination.limit}
    //                 onChangePage={(page) =>
    //                   setPagination((prev) => ({ ...prev, page }))
    //                 }
    //                 onChangePageSize={(pageSize) =>
    //                   setPagination((prev) => ({
    //                     ...prev,
    //                     limit: pageSize,
    //                     page: 1,
    //                   }))
    //                 }
    //                 setShowScreenshotPanel={setShowScreenshotPanel}
    //                 showScreenshotPanel={showScreenshotPanel}
    //                 setRecord={setRecord}
    //               />
    //             ) : (
    //               <ScreenshotPanel
    //                 record={record}
    //                 setRecord={setRecord}
    //                 setShowScreenshotPanel={setShowScreenshotPanel}
    //                 showScreenshotPanel={showScreenshotPanel}
    //               />
    //             )}
    //           </div>
    //         </TabPane>
    //       </Tabs>

    //       <AddFilterSection
    //         onFilterClose={onSuspenseFilterClose}
    //         filterOpen={suspenseFilterOpen}
    //         onSubmitFilter={onSuspenseFilterSubmit}
    //         moduleName={activeTab}
    //         activeFilterData={suspenseFilterData ?? {}}
    //         rowId={suspenseFilterRowId ?? null}
    //         removedData={suspenseRemovedData}
    //         languageId={selectedLang.id}
    //         fetchField={fetchSuspenseField}
    //       />
    //     </>
    //   ),
    // },
  ];
  const handleTabChange = (key) => {
    setActiveTab(key);
    const newType = tabMapping[key];

    if (newType) {
      if (newType === "suspense") {
        navigate(`/donation?type=${newType}&sub=${nestedActiveTab}`);
      } else {
        navigate(`/donation?type=${newType}`);
      }
    } else {
      navigate("/donation"); // No query parameters for Donation tab
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
