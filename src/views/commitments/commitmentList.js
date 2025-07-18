import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
} from "reactstrap";

import {
  getAllCategories,
  getAllMasterCategories,
} from "../../api/categoryApi";
import {
  getAllCommitments,
  importCommitmentFile,
  nudgeUserApi,
} from "../../api/commitmentApi";
import { ChangeStatus } from "../../components/Report & Disput/changeStatus";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { IMPORT, WRITE } from "../../utility/permissionsVariable";

import "../../assets/scss/viewCommon.scss";
import CommitmentAntdListTable from "../../components/commitments/commitmentAntdListTable";
import AddFilterSection from "../../components/partials/addFilterSection";
import filterIcon from "../../assets/images/icons/filter.svg";
import FilterTag from "../../components/partials/filterTag";
import ImportForm from "../donation/importForm";
import { Dropdown, Space, Tooltip } from "antd";

import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import syncIcon from "../../assets/images/icons/sync.svg";
import ImportHistoryTable from "../../components/donation/importHistoryTable";
export default function Commitment() {
  const { t } = useTranslation();
  const importFileRef = useRef();
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [commitmentStatus, setCommitmentStatus] = useState(t("All"));
  const [filterData, setFilterData] = useState({});

  const selectedLang = useSelector((state) => state.auth.selectLang);
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
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;
  const routCategory = categoryTypeName;
  const routSubCategory = subCategoryTypeName;
  const routStatus = commitmentStatus;

  useEffect(() => {
    if (
      currentPage ||
      currentCategory ||
      currentSubCategory ||
      currentStatus ||
      currentFilter
    ) {
      setCategoryTypeName(currentCategory);
      setdropDownName(currentFilter);
      setSubCategoryTypeName(currentSubCategory);
      setCommitmentStatus(currentStatus);
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  // master category
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
  newTypes.forEach((masterCategoryObject) => {
    if (masterCategoryObject.name == categoryTypeName) {
      newId = masterCategoryObject.id;
    }
  });
  const [categoryId, setCategoryId] = useState();

  // sub category
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

  // status
  let payloadStatus;
  if (commitmentStatus == "commitment_complete") {
    payloadStatus = "completed";
  } else if (commitmentStatus == "report_panding") {
    payloadStatus = "Pending";
  } else {
    payloadStatus = "All";
  }
  const filteredData = useMemo(() => {
    return Object.entries(filterData).reduce((acc, [key, value]) => {
      const { index, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data
      return acc;
    }, {});
  }, [filterData]);
  const commitmentQuery = useQuery(
    [
      "Commitments",
      pagination.page,
      pagination.limit,
      selectedLang.id,
      // filterEndDate,
      newId,
      dropDownName,
      subCategoryId,
      commitmentStatus,
      // filterStartDate,
      searchBarValue,
      filteredData,
    ],
    () =>
      getAllCommitments({
        ...pagination,
        // startDate: filterStartDate,
        // endDate: filterEndDate,
        masterId: newId,
        categoryId: subCategoryId,
        status: payloadStatus,
        languageId: selectedLang.id,
        search: searchBarValue,
        ...(filterData && filteredData && { advancedSearch: filteredData }),
      }),
    {
      keepPreviousData: true,
    }
  );

  const commitmentItems = useMemo(
    () => commitmentQuery?.data?.results ?? [],
    [commitmentQuery]
  );
  const totalItems = commitmentQuery.data?.totalResults ?? 0;
  const totalPages = commitmentQuery.data?.totalPages ?? 1;
  const queryClient = useQueryClient();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importCommitmentFile(formData);
      queryClient.invalidateQueries(["Commitments"]);
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
    (permissionName) => permissionName.name === "commitment"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  const [selectedRows, setSelectedRows] = useState(null);
  const handleSelectedRowData = (val) => {
    if (val) {
      setSelectedRows(val);
    }
  };
  const notifyIds = selectedRows?.map((item) => item?.notifyUserId);

  const [popover, setPopover] = useState(false);

  const onHover = () => {
    setPopover(true);
  };
  const onHoverLeave = () => {
    setPopover(false);
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

  const [filterOpen, setFilterOpen] = useState(false);
  const [isfetchField, setIsfetchField] = useState(false);
  const showFilter = () => {
    setFilterOpen(true);
    setIsfetchField(true);
  };
  const onFilterClose = () => {
    setFilterOpen(false);
    setIsfetchField(false);
  };
  const handleApplyFilter = (e) => {
    showFilter();
  };
  const onFilterSubmit = (filterData) => {
    setFilterData(filterData);
  };
  const [removedData, setRemovedData] = useState({});
  const handleRemoveAllFilter = () => {
    const removedFilters = { ...filterData };
    setFilterData({});
    setRemovedData(removedFilters);
  };
  const [rowId, setRowId] = useState(null);
  const removeFilter = (fieldName, id) => {
    const newFilterData = { ...filterData };
    delete newFilterData[fieldName];

    setFilterData(newFilterData);
    setRowId(id);
  };
  const hasFilters = Object.keys(filterData).length > 0;
  const [showHistory, setShowHistory] = useState(false);
  const handleMenuClick = (e) => {
    setShowHistory(true);
  };
  const handleRefresh = () => {
    !showHistory
      ? queryClient.invalidateQueries(["suspenseData"])
      : queryClient.invalidateQueries(["suspenseDataHistory"]);
  };
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Pledge</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addAction d-flex">
              <div className="">
                <div>
                  {showHistory ? (
                    <img
                      src={arrowLeft}
                      className="me-2  cursor-pointer"
                      onClick={() => {
                        setShowHistory(false);
                        queryClient.invalidateQueries("Commitments");
                      }}
                    />
                  ) : (
                    <Trans i18nKey={"commitment"} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-wrap gap-2 gap-md-0 justify-content-end"
            id="donation_view_btn"
          >
            <div className="botton-container">
              <Space className="me-2">
                {showHistory ? (
                  <img
                    src={syncIcon}
                    alt="Loading"
                    style={{ width: 24, height: 24, cursor: "pointer" }}
                    onClick={handleRefresh}
                  />
                ) : (
                  <div></div>
                )}
              </Space>
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
                      setPagination({ page: 1, limit: 10 });
                      navigate(
                        `/commitment?page=${1}&category=${
                          e.target.name
                        }&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
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
                      setPagination({ page: 1, limit: 10 });
                      navigate(
                        `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${
                          e.target.name
                        }&status=${commitmentStatus}&filter=${dropDownName}`
                      );
                    }}
                  />
                </Tooltip>
                <Tooltip title={t("Status")} color="#FF8744">
                  <ChangeStatus
                    className="me-1 donationFilterBtn"
                    dropDownName={commitmentStatus}
                    setdropDownName={(e) => {
                      setCommitmentStatus(e.target.name);
                      setPagination({ page: 1, limit: 10 });
                      navigate(
                        `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${
                          e.target.name
                        }&filter=${dropDownName}`
                      );
                    }}
                  />
                </Tooltip>
              </div>
              <div className="d-flex row2">
                {/* <ChangePeriodDropDown
                  className="me-1 pledgeMonthBtn"
                  dropDownName={dropDownName}
                  setdropDownName={(e) => {
                    setdropDownName(e.target.name);
                    setPagination({ page: 1, limit: 10 });
                    navigate(
                      `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${
                        e.target.name
                      }`
                    );
                  }}
                /> */}
                {allPermissions?.name === "all" ||
                subPermission?.includes(IMPORT) ? (
                  <Space wrap>
                    <Dropdown.Button
                      type="primary"
                      size="large"
                      className="dropDownBtn me-1"
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
                  </Space>
                ) : null}
                <input
                  type="file"
                  ref={importFileRef}
                  accept=""
                  className="d-none"
                  onChange={handleImportFile}
                />
                <Button
                  id="Popover1"
                  color="success"
                  onMouseEnter={onHover}
                  onMouseLeave={onHoverLeave}
                  className={`addAction ms-1 me-1 donationFilterBtn ${
                    notifyIds?.length > 0 ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => {
                    notifyIds?.length > 0 &&
                      nudgeUserApi({ commitmentIds: notifyIds }).then((res) => {
                        if (!res.error) {
                          queryClient.invalidateQueries(["Commitments"]);
                          setSelectedRows(null);
                        }
                      });
                  }}
                >
                  <Trans i18nKey={"notify_user"} />
                </Button>
              </div>
              <div className="d-flex row2">
                {allPermissions?.name === "all" ||
                subPermission?.includes(WRITE) ? (
                  <Button
                    color="primary"
                    className={`addAction-btn me-1`}
                    onClick={() =>
                      navigate(
                        `/commitment/add?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
                      )
                    }
                  >
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                    <span>
                      <Trans i18nKey={"add_commitment"} />
                    </span>
                  </Button>
                ) : (
                  ""
                )}
                {notifyIds?.length <= 0 && (
                  <div className="">
                    <Popover
                      placement="bottom"
                      isOpen={popover}
                      target="Popover1"
                      trigger="hover"
                      className="notifyUserPOP"
                    >
                      <PopoverHeader>
                        {" "}
                        <Trans i18nKey={"notify_user"} />
                      </PopoverHeader>
                      <PopoverBody>
                        <Trans i18nKey={"notify_user_content"} />
                      </PopoverBody>
                    </Popover>
                  </div>
                )}
              </div>
              <Button
                className="secondaryAction-btn"
                color="primary"
                onClick={handleApplyFilter}
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
        </div>
        <div className="d-flex justify-content-between">
          <FilterTag
            hasFilters={hasFilters}
            filterData={filterData}
            removeFilter={removeFilter}
            handleRemoveAllFilter={handleRemoveAllFilter}
          />
        </div>
        <div style={{ height: "10px" }}>
          <If condition={commitmentQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="commitmentContent  ">
          <Row>
            <If condition={commitmentQuery.isLoading} disableMemo>
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
                <If
                  condition={
                    !commitmentQuery.isFetching && commitmentItems.length != 0
                  }
                  disableMemo
                >
                  <Then>
                    {!showHistory ? (
                      <CommitmentAntdListTable
                        data={commitmentItems}
                        selectedRowDATA={handleSelectedRowData}
                        currentFilter={routFilter}
                        currentPage={routPagination}
                        notifyIds={notifyIds}
                        currentCategory={routCategory}
                        currentStatus={routStatus}
                        currentSubCategory={routSubCategory}
                        allPermissions={allPermissions}
                        subPermission={subPermission}
                        totalItems={totalItems}
                        pageSize={pagination.limit}
                        onChangePage={(page) => {
                          setPagination((prev) => ({ ...prev, page }));
                          navigate(
                            `/commitment?page=${page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
                          );
                        }}
                        onChangePageSize={(pageSize) => {
                          setPagination((prev) => ({
                            ...prev,
                            limit: pageSize,
                            page: 1,
                          }));
                        }}
                      />
                    ) : (
                      <ImportHistoryTable tab={"Pledge"} />
                    )}
                  </Then>
                  <Else>
                    {!commitmentQuery.isFetching &&
                      !commitmentQuery.isLoading &&
                      commitmentItems.length == 0 && (
                        <NoContent
                          headingNotfound={t("commitment_not_found")}
                          para={t("commitment_not_click_add_commitment")}
                        />
                      )}
                  </Else>
                </If>
              </Else>
            </If>
          </Row>
        </div>
      </div>
      <ImportForm
        onClose={onClose}
        open={open}
        tab="Pledge"
        setShowHistory={setShowHistory}
      />
      <AddFilterSection
        onFilterClose={onFilterClose}
        filterOpen={filterOpen}
        onSubmitFilter={onFilterSubmit}
        moduleName={"Commitment"}
        activeFilterData={filterData ?? {}}
        rowId={rowId ?? null}
        removedData={removedData}
        languageId={selectedLang.id}
        fetchField={isfetchField}
      />
    </div>
  );
}
