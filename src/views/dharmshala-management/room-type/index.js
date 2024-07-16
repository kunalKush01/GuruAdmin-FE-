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

import { getRoomTypeList } from "../../../api/dharmshala/dharmshalaInfo";
import exportIcon from "../../../assets/images/icons/exportIcon.svg";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import { handleExport } from "../../../utility/utils/exportTabele";
import RoomTypeInfoTable from "./table";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { Helmet } from "react-helmet";
import {RoomTypeInfo} from "../dharmshalaStyles"


const RoomTypesInfo = () => {
  const history = useHistory();
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

  const roomTypeList = useQuery(
    [
      "roomTypeList",
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getRoomTypeList({
        ...pagination,
        search: searchBarValue,
        languageId: selectedLang.id,
      }).then(data => {
        return data;
      })
  );

  const roomTypeListData = useMemo(
    () => roomTypeList?.data?.results ?? [],
    [roomTypeList]
  );

  const queryClient = useQueryClient();

  const isMobileView = window.innerWidth <= 784;

  const filteredroomTypeListData = useMemo(() => {
    const currentDate = moment();
    let filteredData = roomTypeListData;
    if (searchBarValue && searchBarValue.length >= 3) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().startsWith(searchBarValue.toLowerCase().slice(0, 3))
      );
    }
    return filteredData;
    
  }, [roomTypeListData, searchBarValue]);

  return (
    <RoomTypeInfo>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Dharmshala Room Types</title>
      </Helmet>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="dharmshala_roomtypes" />
          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <Button
              className="me-1"
              color="primary"
              onClick={() =>
                history.push(
                  `/roomtype/info/add?page=${pagination.page}&filter=${dropDownName}`
                )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"roomtype_add"} />
              </span>
            </Button>

            
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={roomTypeList.isFetching || roomTypeList.isLoading}>
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
                !roomTypeList.isLoading &&
                filteredroomTypeListData.length>0 &&
                roomTypeListData.length != 0 &&
                !roomTypeList.isFetching
              }
              disableMemo
            >
              <Then>
                <RoomTypeInfoTable
                  data={filteredroomTypeListData}
                  height="160px"
                  currentFilter={routFilter}
                  currentPage={routPagination}
                  isMobileView={isMobileView}
                />
              </Then>
              <Else>
                <If
                  condition={
                    !roomTypeList.isLoading || filteredroomTypeListData.length===0 || roomTypeListData.length == 0
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
                !roomTypeList.isFetching && roomTypeList?.data?.totalPages > 1
              }
            >
              <Then>
                <Col xs={12} className=" d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={roomTypeList?.data?.totalPages || 0}
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
                        `/roomType/info?page=${
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
    </RoomTypeInfo>
  );
};

export default RoomTypesInfo;
