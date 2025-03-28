import React, { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { ExpensesListTable } from "../../components/internalExpenses/expensesListTable";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { WRITE } from "../../utility/permissionsVariable";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import filterIcon from "../../assets/images/icons/filter.svg";

import "../../assets/scss/viewCommon.scss";
import FilterTag from "../../components/partials/filterTag";
import AddFilterSection from "../../components/partials/addFilterSection";

export default function Expenses() {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
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
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  // useEffect(() => {
  //   setPagination({ page: 1, limit: 10 });
  // }, []);
  const [expenseType, setExpenseType] = useState(t("All"));

  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentExpenseType = searchParams.get("expenseType");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;
  const routeExpenseType = expenseType;

  const ExpenseType = [
    {
      id: 0,
      name: t("All"),
    },
    {
      id: 1,
      name: t("cattle_expense_type_general"),
    },
    {
      id: 2,
      name: t("cattle_expense_type_assets"),
    },
    {
      id: 3,
      name: t("cattle_expense_type_consumable"),
    },
    ,
  ];

  useEffect(() => {
    if (currentPage || currentFilter || currentExpenseType) {
      setdropDownName(currentFilter);
      setExpenseType(currentExpenseType);
      setPagination({ ...pagination, page: parseInt(currentPage) });
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
  const filteredData = useMemo(() => {
    return Object.entries(filterData).reduce((acc, [key, value]) => {
      const { index, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data
      return acc;
    }, {});
  }, [filterData]);
  const expensesQuery = useQuery(
    [
      "Expenses",
      pagination.page,
      pagination.limit,
      selectedLang.id,
      // filterEndDate,
      expenseType,
      // filterStartDate,
      searchBarValue,
      filteredData,
    ],
    () =>
      getAllExpense({
        ...pagination,
        // startDate: filterStartDate,
        // endDate: filterEndDate,
        expenseType:
          expenseType === t("All") ? undefined : expenseType.toUpperCase(),
        languageId: selectedLang.id,
        search: searchBarValue,
        ...(filterData && filteredData && { advancedSearch: filteredData }),
      }),
    {
      keepPreviousData: true,
    }
  );

  const categoryItems = useMemo(
    () => expensesQuery?.data?.results ?? [],
    [expensesQuery]
  );
  const totalItems = useMemo(
    () => expensesQuery?.data?.totalResults || 0,
    [expensesQuery]
  );
  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "internal_expenses"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

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
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Expenses</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => history.push("/")}
            /> */}
            <div className="addAction">
              <div className="">
                <div>
                  <Trans i18nKey={"expenses_latest_Expenses"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction">
            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={ExpenseType}
              typeName={expenseType}
              setTypeName={(e) => {
                setExpenseType(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/internal_expenses?page=${1}&expenseType=${
                    e.target.name
                  }&filter=${dropDownName}`
                );
              }}
            />

            {/* <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/internal_expenses?page=${1}&expenseType=${expenseType}&filter=${
                    e.target.name
                  }`
                );
              }}
            /> */}

            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn me-1"
                onClick={() =>
                  history.push(
                    `/internal_expenses/add?page=${pagination.page}&expenseType=${expenseType}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"expenses_AddExpenses"} />
                </span>
              </Button>
            ) : (
              ""
            )}
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
        <div className="d-flex justify-content-between">
          <FilterTag
            hasFilters={hasFilters}
            filterData={filterData}
            removeFilter={removeFilter}
            handleRemoveAllFilter={handleRemoveAllFilter}
          />
        </div>
        <div style={{ height: "10px" }}>
          <If condition={expensesQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="expenseContent mb-3">
          <Row>
            <If condition={expensesQuery.isLoading} disableMemo>
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
                <If condition={categoryItems.length != 0} disableMemo>
                  <Then>
                    <ExpensesListTable
                      data={categoryItems}
                      currentFilter={routFilter}
                      currentExpenseFilter={routeExpenseType}
                      // currentPage={routPagination}
                      page={pagination}
                      allPermissions={allPermissions}
                      subPermission={subPermission}
                      expenseTotalItem={totalItems}
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
                      headingNotfound={t("expence_not_found")}
                      para={t("expence_not_click_add_expence")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            {/* <If condition={expensesQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={expensesQuery?.data?.totalPages || 0}
                    activeClassName="active"
                    initialPage={
                      parseInt(searchParams.get("page"))
                        ? parseInt(searchParams.get("page")) - 1
                        : pagination.page - 1
                    }
                    breakClassName="page-item"
                    pageClassName={"page-item"}
                    breakLinkClassName="page-link"
                    nextLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    nextClassName={"page-item next"}
                    previousLinkClassName={"page-link"}
                    previousClassName={"page-item prev"}
                    onPageChange={(page) => {
                      setPagination({ ...pagination, page: page.selected + 1 });
                      history.push(
                        `/internal_expenses?page=${
                          page.selected + 1
                        }&expenseType=${expenseType}&filter=${dropDownName}`
                      );
                    }}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                  />
                </Col>
              </Then>
            </If> */}
          </Row>
        </div>
      </div>
      <AddFilterSection
        onFilterClose={onFilterClose}
        filterOpen={filterOpen}
        onSubmitFilter={onFilterSubmit}
        moduleName={"Expense"}
        activeFilterData={filterData ?? {}}
        rowId={rowId ?? null}
        removedData={removedData}
        languageId={selectedLang.id}
        fetchField={isfetchField}
      />
    </div>
  );
}
