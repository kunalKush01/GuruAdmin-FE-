import React, { useEffect, useMemo, useRef, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";

import {
  exportData,
  getCattlesList,
  importFile,
} from "../../../api/cattle/cattleInfo";
import exportIcon from "../../../assets/images/icons/exportIcon.svg";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import { handleExport } from "../../../utility/utils/exportTabele";
import { exportCattleJson, exportCattleJsonSample } from "./exportableJsonData";
import CattleInfoTable from "./table";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { Helmet } from "react-helmet";
import { WRITE } from "../../../utility/permissionsVariable";

const CattleInfo = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .btn {
    font-weight: bold;
  }
`;

const CattlesInfo = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const importFileRef = useRef();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [isDeadAlive, setIsDeadAlive] = useState("All");
  // const [cattleBreed, setCattleBreed] = useState(t("all"));

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  // const currentBreed = searchParams.get("breed");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;
  const routeStatus = isDeadAlive;
  // const routeBreed = cattleBreed;

  useEffect(() => {
    if (currentPage || currentFilter || currentStatus) {
      // setCattleBreed(currentBreed);
      setdropDownName(currentFilter);
      setIsDeadAlive(currentStatus);
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const cattleList = useQuery(
    [
      "cattleList",
      filterStartDate,
      filterEndDate,
      isDeadAlive,
      // cattleBreed,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getCattlesList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        deadStatus: isDeadAlive,
        // breed: cattleBreed,
        languageId: selectedLang.id,
      })
  );

  const cattleListData = useMemo(
    () => cattleList?.data?.results ?? [],
    [cattleList]
  );

  const exportDataQuery = useQuery([], () =>
    exportData({
      limit: cattleList?.data?.totalResults,
      startDate: filterStartDate,
      deadStatus: isDeadAlive,
      endDate: filterEndDate,
      languageId: selectedLang.id,
    })
  );

  const queryClient = useQueryClient();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importFile(formData);
      queryClient.invalidateQueries(["cattleList"]);
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
    (permissionName) => permissionName.name === "cattle-info"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <CattleInfo>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Cattles</title>
      </Helmet>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="cattle_registered" />

          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={[
                {
                  id: 1,
                  name: t("all"),
                },
                {
                  id: 2,
                  name: t("cattle_dead"),
                },
                {
                  id: 3,
                  name: t("cattle_alive"),
                },
              ]}
              typeName={isDeadAlive}
              setTypeName={(e) => {
                setIsDeadAlive(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/cattle/info?page=${1}&status=${
                    e.target.name
                  }&filter=${dropDownName}`
                );
              }}
            />
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/cattle/info?page=${1}&status=${isDeadAlive}&filter=${
                    e.target.name
                  }`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                className="me-1"
                color="primary"
                onClick={() =>
                  history.push(
                    `/cattle/info/add?page=${pagination.page}&status=${isDeadAlive}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"cattle_add"} />
                </span>
              </Button>
            ) : (
              ""
            )}

            <Button
              className="me-1"
              color="primary"
              onClick={() => importFileRef.current.click()}
            >
              Import File
            </Button>

            {/* <Button
              color="primary"
              className="me-1"
              onClick={() =>
                handleExport({
                  dataName: exportCattleJsonSample([]),
                  fileName: "Sample Cattles List",
                  sheetName: "Sample Cattles List",
                })
              }
            >
              Sample File
            </Button> */}

            <Button
              color="primary"
              onClick={() =>
                handleExport({
                  dataName: exportCattleJson(
                    exportDataQuery?.data.results ?? []
                  ),
                  fileName: "Cattles List",
                  sheetName: "Cattles List",
                })
              }
            >
              <Trans i18nKey={"export_report"} />
              <img src={exportIcon} width={15} className="ms-2" />
            </Button>
            <input
              type="file"
              ref={importFileRef}
              accept=""
              className="d-none"
              onChange={handleImportFile}
            />
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={cattleList.isFetching || cattleList.isLoading}>
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
                !cattleList.isLoading &&
                cattleListData.length != 0 &&
                !cattleList.isFetching
              }
              disableMemo
            >
              <Then>
                <CattleInfoTable
                  data={cattleListData}
                  height="160px"
                  currentFilter={routFilter}
                  currentPage={routPagination}
                  // currentBreed={routeBreed}
                  currentStatus={routeStatus}
                  allPermissions={allPermissions}
                  subPermission={subPermission}
                />
              </Then>
              <Else>
                <If
                  condition={
                    !cattleList.isLoading && cattleListData.length == 0
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
            <If
              condition={
                !cattleList.isFetching && cattleList?.data?.totalPages > 1
              }
            >
              <Then>
                <Col xs={12} className=" d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={cattleList?.data?.totalPages || 0}
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
                        `/cattle/info?page=${
                          page.selected + 1
                        }&status=${isDeadAlive}&filter=${dropDownName}`
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
    </CattleInfo>
  );
};

export default CattlesInfo;
