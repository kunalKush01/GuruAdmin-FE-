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
import { getCattlesMedicalList } from "../../../api/cattle/cattleMedical";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import MedicalReportTable from "./table";
import { Helmet } from "react-helmet";
import { WRITE } from "../../../utility/permissionsVariable";
import "../../../assets/scss/viewCommon.scss";
const CattlesMedical = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    if (currentPage || currentFilter) {
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

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

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const cattleMedicalList = useQuery(
    [
      "cattleMedicalList",
      filterStartDate,
      filterEndDate,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getCattlesMedicalList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      })
  );

  const cattleMedicalListData = useMemo(
    () => cattleMedicalList?.data?.results ?? [],
    [cattleMedicalList]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "cattle-medical"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <div className="medicalwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Cattles Medical Records</title>
      </Helmet>
      <div>
        <Row className="mb-1 d-flex justify-content-between align-items-center">
          <Col xs={12} sm="auto">
            <Trans i18nKey="cattle_medical_record" />
          </Col>
          <Col xs={12} sm="auto" className="d-flex flex-wrap mt-1 mt-sm-0">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/cattle/medical-info?page=${1}&filter=${e.target.name}`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                onClick={() =>
                  navigate(
                    `/cattle/medical-info/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
                style={{ height: "38px" }}
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"cattle_medical_add"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
      <div style={{ height: "10px" }}>
        <If
          condition={
            cattleMedicalList.isFetching && cattleMedicalList.isLoading
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
      <div className="newsContent  ">
        <Row>
          <If
            condition={
              !cattleMedicalList.isLoading &&
              cattleMedicalListData.length != 0 &&
              !cattleMedicalList.isFetching
            }
            disableMemo
          >
            <Then>
              <MedicalReportTable
                data={cattleMedicalListData}
                allPermissions={allPermissions}
                subPermission={subPermission}
                // maxHeight="160px"
                height="160px"
                currentFilter={dropDownName}
                currentPage={pagination.page}
              />
            </Then>
            <Else>
              <If
                condition={
                  !cattleMedicalList.isLoading &&
                  cattleMedicalListData.length == 0
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

          <If condition={cattleMedicalList?.data?.totalPages > 1}>
            <Then>
              <Col xs={12} className="mb-2 d-flex justify-content-center">
                <ReactPaginate
                  nextLabel=""
                  forcePage={pagination.page - 1}
                  breakLabel="..."
                  previousLabel=""
                  pageCount={cattleMedicalList?.data?.totalPages || 0}
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
                      `/cattle/medical-info?page=${
                        page.selected + 1
                      }&filter=${dropDownName}`
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
  );
};

export default CattlesMedical;
