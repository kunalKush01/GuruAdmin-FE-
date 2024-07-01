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
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { getDharmshalaFloorList } from "../../../api/dharmshala/dharmshalaInfo";
import exportIcon from "../../../assets/images/icons/exportIcon.svg";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import { handleExport } from "../../../utility/utils/exportTabele";
import DharmshalaFloorTable from "./table";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DharmshalaFloorInfo } from "../dharmshalaStyles";
import "../dharmshala_css/dharmshalafloors.css";

const DharmshalaFloors = () => {
  const history = useHistory();
  const { buildingId } = useParams();
  const { t } = useTranslation();
  const importFileRef = useRef();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;

  useEffect(() => {
    if (currentPage || currentFilter || currentStatus) {
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const dharmshalaFloorList = useQuery(
    [
      "dharmshalaFloorList",
      pagination?.page,
      buildingId,
      selectedLang.id,
      searchBarValue,
    ],
    () => getDharmshalaFloorList(buildingId)
  );

  const dharmshalaFloorListData = useMemo(
    () => dharmshalaFloorList?.data?.results ?? [],
    [dharmshalaFloorList]
  );

  const isMobileView = window.innerWidth <= 784;

  return (
    <DharmshalaFloorInfo>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Dharmshala Floors</title>
      </Helmet>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center header-container">
          <div className="d-flex align-items-center left-container">
            <img
              src={arrowLeft}
              className="me-2 cursor-pointer"
              onClick={() =>
                history.push(
                  `/dharmshala/info?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
                )
              }
            />
            <div className="addEvent">
              <Trans i18nKey={"dharmshala_floors_registered"} />
            </div>
          </div>
          <div className="d-flex mt-1 mt-sm-0 right-container">
            <Button
              className="me-1"
              color="primary"
              onClick={() =>
                history.push(
                  `/floor/add/${buildingId}/add?page=${pagination.page}&filter=${dropDownName}`
                )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"dharmshala_floor_add"} />
              </span>
            </Button>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If
            condition={
              dharmshalaFloorList.isFetching || dharmshalaFloorList.isLoading
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
        <div className="newsContent">
          <Row>
            <If
              condition={
                !dharmshalaFloorList.isLoading &&
                dharmshalaFloorListData.length != 0 &&
                !dharmshalaFloorList.isFetching
              }
              disableMemo
            >
              <Then>
                <DharmshalaFloorTable
                  data={dharmshalaFloorListData}
                  height="160px"
                  currentFilter={routFilter}
                  currentPage={routPagination}
                  isMobileView={isMobileView}
                />
              </Then>
              <Else>
                <If
                  condition={
                    !dharmshalaFloorList.isLoading &&
                    dharmshalaFloorListData.length == 0
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
                !dharmshalaFloorList.isFetching &&
                dharmshalaFloorList?.data?.totalPages > 1
              }
            >
              <Then>
                <Col xs={12} className=" d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={dharmshalaFloorList?.data?.totalPages || 0}
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
                        `/dharmshala/info?page=${
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
    </DharmshalaFloorInfo>
  );
};

export default DharmshalaFloors;
