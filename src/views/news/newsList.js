import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllNews } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NewsCard from "../../components/news/newsCard";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { WRITE } from "../../utility/permissionsVariable";
import { Helmet } from "react-helmet";
import "../../assets/scss/viewCommon.scss";
import { Card, Pagination } from "antd";

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function News() {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("All");
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const periodDropDown = () => {
    switch (dropDownName) {
      case "dashboard_monthly":
        return "month";
      case "dashboard_yearly":
        return "year";
      case "dashboard_weekly":
        return "week";
      case "All":
        return "All";
      default:
        return "All";
    }
  };
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
  });
  const [currentpage, setCurrentpage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const onChangePage = (page) => {
    setCurrentpage(page);
    // Fetch new data based on the page
  };

  const onChangePageSize = (size) => {
    setPageSize(size);
    setCurrentpage(1); // Reset to first page when page size changes
  };
  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;

  useEffect(() => {
    if (currentPage || currentFilter) {
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

  const getQueryParams = () => {
    const baseParams = {
      ...pagination,
      languageId: selectedLang.id,
      search: searchBarValue,
      page: currentpage,
      limit: pageSize,
    };

    if (dropDownName !== "All") {
      return {
        ...baseParams,
        startDate: filterStartDate,
        endDate: filterEndDate,
      };
    }

    return baseParams;
  };

  let filterStartDate =
    dropDownName !== "All"
      ? moment().startOf(periodDropDown()).utcOffset(0, true).toISOString()
      : null;
  let filterEndDate =
    dropDownName !== "All"
      ? moment().endOf(periodDropDown()).utcOffset(0, true).toISOString()
      : null;

  let startDate = moment(filterStartDate).format("DD MMM");
  let endDate = moment(filterEndDate).utcOffset(0).format("DD MMM, YYYY");
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const newsQuery = useQuery(
    [
      "News",
      currentpage,
      pageSize,
      filterStartDate,
      filterEndDate,
      selectedLang.id,
      searchBarValue,
    ],
    () => getAllNews(getQueryParams()),
    {
      keepPreviousData: true,
    }
  );

  const newsItems = useMemo(() => newsQuery?.data?.results ?? [], [newsQuery]);
  const totalItems = useMemo(
    () => newsQuery?.data?.totalResults ?? [],
    [newsQuery]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "news"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | News</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => navigate("/")}
            /> */}
            <div className="addAction">
              <div className="">
                <div>
                  <Trans i18nKey={"news_latest_news"} />
                </div>
                {/* <div className="filterPeriod">
                  <span>
                    {startDate} - {endDate}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="addAction gap-1 justify-content-between">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(`/news?page=${1}&filter=${e.target.name}`);
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn"
                onClick={() =>
                  navigate(
                    `/news/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"news_btn_AddNews"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={newsQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="punyarjakContent">
          <Row style={{marginBottom:"100px"}}>
            <If condition={newsQuery.isLoading} disableMemo>
              <Then>
                <SkeletonTheme
                  baseColor="#FFF7E8"
                  highlightColor="#fff"
                  borderRadius={"10px"}
                >
                  {randomArray.map((itm, idx) => {
                    return (
                      <Col>
                        <Skeleton height={"335px"} width={"100%"} />
                      </Col>
                    );
                  })}
                </SkeletonTheme>
              </Then>
              <Else>
                <If condition={newsItems.length != 0} disableMemo>
                  <Then>
                    {newsItems.map((item) => {
                      return (
                        <Col
                          xs={12}
                          md={6}
                          lg={4}
                          className="pe-sm-3 pe-0"
                          style={{ paddingTop: "3rem" }}
                          key={item.id}
                        >
                          <NewsCard
                            data={item}
                            currentFilter={routFilter}
                            currentPage={routPagination}
                            allPermissions={allPermissions}
                            subPermission={subPermission}
                          />
                        </Col>
                      );
                    })}
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("news_not_found")}
                      para={t("news_not_click_add_news")}
                    />
                  </Else>
                </If>
              </Else>
            </If>
            {totalItems > 0 && (
              <Card className="pagination-card">
                <Pagination
                  current={currentpage}
                  pageSize={pageSize}
                  total={totalItems}
                  onChange={onChangePage}
                  onShowSizeChange={(current, size) => onChangePageSize(size)}
                  showSizeChanger
                />
              </Card>
            )}
            {/* <If condition={newsQuery?.data?.totalPages > 0}>
              <Then>
                <Col
                  xs={12}
                  className="d-flex justify-content-center pagination-container mt-3"
                >
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={newsQuery?.data?.totalPages || 0}
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
                    }}
                    // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
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
    </div>
  );
}
