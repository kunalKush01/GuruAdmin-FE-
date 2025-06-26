import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getCattlesPregnancyList } from "../../../api/cattle/cattlePregnancy";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import PregnancyReportTable from "./table";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { Helmet } from "react-helmet";
import { WRITE } from "../../../utility/permissionsVariable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";

import "../../../assets/scss/viewCommon.scss";
import { Tooltip } from "antd";
const PregnancyReport = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pregnancyStatus, setPregnancyStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page") || 1;
  const currentPregnancyStatus = searchParams.get("status") || "All";
  const currentFilter = searchParams.get("filter") || "dashboard_monthly";

  useEffect(() => {
    setdropDownName(currentFilter);
    setPregnancyStatus(currentPregnancyStatus);
    setPagination((prev) => ({ ...prev, page: parseInt(currentPage) }));
  }, [currentPage, currentFilter, currentPregnancyStatus]);

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

  const filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  const filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const cattlePregnancyList = useQuery(
    [
      "cattlePregnancyList",
      filterStartDate,
      pregnancyStatus,
      filterEndDate,
      pagination.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getCattlesPregnancyList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        status:
          pregnancyStatus === "Inactive"
            ? "NO"
            : pregnancyStatus === "Active"
            ? "YES"
            : "ALL",
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );

  const cattlePregnancyListData = useMemo(
    () => cattlePregnancyList?.data?.results ?? [],
    [cattlePregnancyList]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "cattle-pregnancy"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <div className="pregnancyreportwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Cattles Pregnancy Records</title>
      </Helmet>
      <div>
        <Row className="mb-1 d-flex justify-content-between align-items-center">
          <Col xs={12} sm="auto">
            <Trans i18nKey="cattle_pregnancy_report" />
          </Col>
          <Col xs={12} sm="auto" className="d-flex flex-wrap mt-1 mt-sm-0">
            <Tooltip title={t("cattle_pregnancy_status")} color="#FF8744">
              <ChangeCategoryType
                className={"me-1"}
                categoryTypeArray={[
                  {
                    id: 1,
                    name: t("All"),
                    value: "ALL",
                  },
                  {
                    id: 2,
                    name: t("Active"),
                    value: "YES",
                  },
                  {
                    id: 2,
                    name: t("Inactive"),
                    value: "NO",
                  },
                ]}
                typeName={ConverFirstLatterToCapital(pregnancyStatus)}
                setTypeName={(e) => {
                  setPregnancyStatus(e.target.name);
                  setPagination({ page: 1 });
                  navigate(
                    `/cattle/pregnancy-reports?page=${1}&status=${
                      e.target.name
                    }&filter=${dropDownName}`
                  );
                }}
              />
            </Tooltip>
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/cattle/pregnancy-reports?page=${1}&status=${pregnancyStatus}&filter=${
                    e.target.name
                  }`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                onClick={() =>
                  navigate(
                    `/cattle/pregnancy-reports/add?page=${pagination.page}&status=${pregnancyStatus}&filter=${dropDownName}`
                  )
                }
                className="mt-1 mt-sm-0"
                style={{ height: "38px" }}
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"cattle_pregnancy_report_add"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
        <div style={{ height: "10px" }}>
          <If
            condition={
              cattlePregnancyList.isFetching && cattlePregnancyList.isLoading
            }
          >
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="">
          <Row>
            <If
              condition={
                !cattlePregnancyList.isLoading &&
                cattlePregnancyListData.length != 0 &&
                !cattlePregnancyList.isFetching
              }
              disableMemo
            >
              <Then>
                <PregnancyReportTable
                  data={cattlePregnancyListData}
                  currentFilter={dropDownName}
                  currentPregnancyStatus={pregnancyStatus}
                  // maxHeight="220px"
                  height="160px"
                  currentPage={pagination.page}
                  allPermissions={allPermissions}
                  subPermission={subPermission}
                />
              </Then>
              <Else>
                <If
                  condition={
                    !cattlePregnancyList.isLoading &&
                    cattlePregnancyListData.length == 0
                  }
                  disableMemo
                >
                  <Then>
                    <NoContent
                      headingNotfound={t("no_data_found")}
                      para={t("no_data_found_add_data")}
                    />
                  </Then>
                </If>
              </Else>
            </If>

            <If condition={cattlePregnancyList?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={cattlePregnancyList?.data?.totalPages || 0}
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
                      navigate(
                        `/cattle/pregnancy-reports?page=${
                          page.selected + 1
                        }&status=${pregnancyStatus}&filter=${dropDownName}`
                      );
                    }}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                  />
                </Col>
              </Then>
            </If>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PregnancyReport;
