import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { Children, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
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
import { WRITE } from "../../utility/permissionsVariable";
import DonationANTDListTable from "../../components/donation/donationAntdListTable";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import filterIcon from "../../assets/images/icons/filter.svg";
import "../../assets/scss/viewCommon.scss";
import SuspenseListTable from "../../components/donation/suspenseListTable";
import SuspenseHistoryTable from "../../components/donation/suspenseHistoryTable";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { addSuspense } from "../../api/suspenseApi";
import loadingOutlined from "../../assets/images/icons/loadingIco.svg";
import syncIcon from "../../assets/images/icons/sync.svg";
import AddFilterSection from "../../components/partials/addFilterSection";
import FilterTag from "../../components/partials/filterTag";
import ImportForm from "./importForm";

const CustomDatePicker = DatePicker.generatePicker(momentGenerateConfig);
export default function Donation() {
  const history = useHistory();
  const importFileRef = useRef();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const donation_type = searchParams.get("type");
  const [categoryTypeName, setCategoryTypeName] = useState("All");
  const [subCategoryTypeName, setSubCategoryTypeName] = useState("All");
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [activeTab, setActiveTab] = useState(
    donation_type ? donation_type : "Donation"
  );
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
  const { t } = useTranslation();
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
  const newTypes = [{ id: "", name: "All" }, ...categoryTypeItem];

  let newId;
  newTypes.forEach((newObject) => {
    if (newObject.name == categoryTypeName) {
      newId = newObject.id;
    }
  });
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
  const subCategoryTypes = [{ id: "", name: "All" }, ...subCategoryTypeItem];

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
      const { index,label, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data without 'index'
      return acc;
    }, {});
  }, [
    donationFilterData,
    articleDonationFilterData,
    suspenseFilterData,
    activeTab,
  ]);

  const donationQuery = useQuery(
    [
      "donations",
      pagination.page,
      pagination.limit,
      selectedLang.id,
      newId,
      subCategoryId,
      filterEndDate,
      filterStartDate,
      searchBarValue,
      filteredData,
    ],
    () =>
      getAllDonation({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        masterId: newId,
        categoryId: subCategoryId,
        endDate: filterEndDate,
        languageId: selectedLang.id,
        ...((donationFilterData || articleDonationFilterData) &&
          filteredData && { advancedSearch: filteredData }),
      }),
    {
      keepPreviousData: true,
      enabled: activeTab === "Donation" || activeTab === "Article_Donation",
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
  const [showHistory, setShowHistory] = useState(false);
  const handleMenuClick = (e) => {
    setShowHistory(true);
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
        transactionDate: formattedDate || "",
        transactionId: values.transactionId || "",
        bankNarration: values.bankNarration || "",
        chequeNo: values.chequeNo || "",
        amount: values.amount || "",
        modeOfPayment: values.modeOfPayment || "",
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
  const isFetchingSuspense = !showHistory
    ? useIsFetching({ queryKey: ["suspenseData"] }) > 0
    : useIsFetching({ queryKey: ["suspenseDataHistory"] }) > 0;
  const handleRefresh = () => {
    !showHistory
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
  const [fetchDonationField, setFetchDonationField] = useState(false)
  const [fetchArticleDonationField, setFetchArticleDonationField] = useState(false)
  const [fetchSuspenseField, setFetchSuspenseField] = useState(false)
  // Functions for Donation tab
  const showDonationFilter = () => {
    setDonationFilterOpen(true);
    setFetchDonationField(true)
  };

  const onDonationFilterClose = () => {
    setDonationFilterOpen(false);
    setFetchDonationField(false)
  };

  const handleApplyDonationFilter = () => {
    showDonationFilter();
  };

  // Functions for Article Donation tab
  const showArticleDonationFilter = () => {
    setArticleDonationFilterOpen(true);
    setFetchArticleDonationField(true)
  };

  const onArticleDonationFilterClose = () => {
    setArticleDonationFilterOpen(false);
    setFetchArticleDonationField(false)
  };

  const handleApplyArticleDonationFilter = () => {
    showArticleDonationFilter();
  };

  // Functions for Suspense tab
  const showSuspenseFilter = () => {
    setSuspenseFilterOpen(true);
    setFetchSuspenseField(true)
  };

  const onSuspenseFilterClose = () => {
    setSuspenseFilterOpen(false);
    setFetchSuspenseField(false)
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

  // Donation split tab
  const items = [
    {
      key: "Donation",
      label: t("donation"),
      children: (
        <>
          <div
            className="d-flex flex-wrap gap-2 gap-md-0 justify-content-end"
            id="donation_view_btn"
          >
            <div className="botton-container">
              <div className="d-flex row1 me-1">
                <ChangeCategoryType
                  className={"me-1"}
                  categoryTypeArray={newTypes}
                  typeName={ConverFirstLatterToCapital(categoryTypeName ?? "")}
                  setTypeName={(e) => {
                    setCategoryId(e.target.id);
                    setCategoryTypeName(e.target.name);
                    setPagination({ page: 1 });
                    history.push(
                      `/donation?page=${1}&category=${
                        e.target.name
                      }&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                    );
                  }}
                />

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
                    history.push(
                      `/donation?page=${1}&category=${categoryTypeName}&subCategory=${
                        e.target.name
                      }&filter=${dropDownName}`
                    );
                  }}
                />
                <ChangePeriodDropDown
                  dropDownName={dropDownName}
                  setdropDownName={(e) => {
                    setdropDownName(e.target.name);
                    setPagination({ page: 1 });
                    history.push(
                      `/donation?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${
                        e.target.name
                      }`
                    );
                  }}
                />
              </div>
              <div className="row2">
                <Button
                  className={`secondaryAction-btn me-1`}
                  color="primary"
                  onClick={handleButtonClick}
                  // onClick={() => importFileRef.current.click()}
                >
                  {t("Import_File")}
                </Button>

                <input
                  type="file"
                  ref={importFileRef}
                  accept=""
                  className="d-none"
                  onChange={handleImportFile}
                />

                {allPermissions?.name === "all" ||
                subPermission?.includes(WRITE) ? (
                  <Button
                    color="primary"
                    className={`addAction-btn me-1`}
                    onClick={() =>
                      history.push(
                        `/donation/add?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}&type=${activeTab}`
                      )
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
              </div>
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
          <div
            className="d-flex flex-wrap gap-2 gap-md-0 justify-content-end"
            id="donation_view_btn"
          >
            <div className="botton-container">
              <div className="d-flex row1">
                <ChangeCategoryType
                  className={"me-1"}
                  categoryTypeArray={newTypes}
                  typeName={ConverFirstLatterToCapital(categoryTypeName ?? "")}
                  setTypeName={(e) => {
                    setCategoryId(e.target.id);
                    setCategoryTypeName(e.target.name);
                    setPagination({ page: 1 });
                    history.push(
                      `/donation?page=${1}&category=${
                        e.target.name
                      }&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                    );
                  }}
                />

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
                    history.push(
                      `/donation?page=${1}&category=${categoryTypeName}&subCategory=${
                        e.target.name
                      }&filter=${dropDownName}`
                    );
                  }}
                />
                <ChangePeriodDropDown
                  className="me-1 donationFilterBtn"
                  dropDownName={dropDownName}
                  setdropDownName={(e) => {
                    setdropDownName(e.target.name);
                    setPagination({ page: 1 });
                    history.push(
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
                      history.push(
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
    {
      key: "Suspense",
      label: t("suspense"),
      children: (
        <>
          <div className="d-flex justify-content-between align-items-center">
            {showHistory ? (
              <img
                src={arrowLeft}
                className="me-2  cursor-pointer"
                onClick={() => setShowHistory(false)}
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
                {!showHistory &&
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
                    onClick: handleMenuClick,
                  }}
                  onClick={handleButtonClick}
                >
                  {t("import")}
                </Dropdown.Button>
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
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">
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

                  <Form.Item name="transactionId" label={t("suspense_transId")}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="bankNarration"
                    label={t("bankNarration")}
                    rules={[
                      { required: true, message: t("req_bankNarration") },
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>

                  <Form.Item name="chequeNo" label={t("suspense_cheque_no")}>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="amount"
                    label={t("suspense_amount")}
                    rules={[{ required: true, message: t("req_ammount") }]}
                  >
                    <Input type="number" min="0" step="0.01" />
                  </Form.Item>

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
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button color="primary" htmlType="submit">
                      {t("add_record")}
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <FilterTag
              hasFilters={hasFilters}
              filterData={suspenseFilterData}
              removeFilter={suspenseRemoveFilter}
              handleRemoveAllFilter={suspenseRemoveAllFilter}
            />
          </div>
          <div className="donationContent mt-1">
            {!showHistory ? (
              <SuspenseListTable
                success={success}
                filterData={filteredData}
                type={activeTab}
              />
            ) : (
              <SuspenseHistoryTable />
            )}
          </div>
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
          defaultActiveKey={activeTab}
          className="donationTab"
          items={items}
          onChange={handleTabChange}
        />
      </div>
      <ImportForm
        onClose={onClose}
        open={open}
        tab={activeTab}
        setShowHistory={setShowHistory}
      />
    </div>
  );
}
