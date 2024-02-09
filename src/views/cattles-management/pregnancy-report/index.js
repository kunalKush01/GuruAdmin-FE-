import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getCattlesPregnancyList } from "../../../api/cattle/cattlePregnancy";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import PregnancyReportTable from "./table";

const PregnancyReportWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .btn {
    font-weight: bold;
  }
`;

const PregnancyReport = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
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

  const cattlePregnancyList = useQuery(
    [
      "cattlePregnancyList",
      filterStartDate,
      filterEndDate,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getCattlesPregnancyList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      })
  );

  const cattlePregnancyListData = useMemo(
    () => cattlePregnancyList?.data?.results ?? [],
    [cattlePregnancyList]
  );
  return (
    <PregnancyReportWrapper>
      {/* <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} /> */}
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="cattle_pregnancy_report" />

          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/cattle/pregnancy-reports?page=${1}&filter=${e.target.name}`
                );
              }}
            />
            {/* {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? ( */}
            <Button
              color="primary"
              onClick={() =>
                history.push(
                  `/cattle/pregnancy-reports/add?page=${pagination.page}&filter=${dropDownName}`
                )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"cattle_pregnancy_report_add"} />
              </span>
            </Button>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
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
                  maxHeight="220px"
                  currentPage={pagination.page}
                  // allPermissions={allPermissions}
                  // subPermission={subPermission}
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

            <If condition={cattlePregnancyListData?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={cattlePregnancyListData?.data?.totalPages || 0}
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
                        `/cattle/pregnancy-reports?page=${
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
    </PregnancyReportWrapper>
  );
};

export default PregnancyReport;
