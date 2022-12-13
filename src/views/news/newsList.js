import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllNews } from "../../api/newsApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NewsCard from "../../components/news/newsCard";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
`;

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function News() {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const selectedLang= useSelector(state=>state.auth.selectLang)
  
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
  const history = useHistory();
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  });

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  let startDate = moment(filterStartDate).format("D MMM YYYY");
  let endDate = moment(filterEndDate).utcOffset(0).format("D MMM YYYY");

  const newsQuery = useQuery(
    ["News", pagination.page, filterStartDate, filterEndDate,selectedLang.id],
    () =>
      getAllNews({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId:selectedLang.id
      }),
    {
      keepPreviousData: true,
    }
  );

  const newsItems = useMemo(() => newsQuery?.data?.results ?? [], [newsQuery]);

  return (
    <NewsWarper>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer"
              onClick={() => history.push("/")}
            />
            <div className="addNews">
              <div className="">
                <div>
                  <Trans i18nKey={"news_latest_news"} />
                </div>
                <div className="filterPeriod">
                  <span>
                    {startDate}-{endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addNews">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => setdropDownName(e.target.name)}
            />
            <Button
              color="primary"
              className="addNews-btn"
              onClick={() => history.push("/news/add")}
            >
              <span>
                <Plus className="me-1" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"news_btn_AddNews"} />
              </span>
            </Button>
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
        <div className="newsContent  ">
          <Row>
            <If condition={newsQuery.isLoading} disableMemo>
              <Then>
                <SkeletonTheme
                  baseColor="#FFF7E8"
                  highlightColor="#fff"
                  borderRadius={"10px"}
                >
                  {randomArray.map((itm, idx) => {
                    return (
                      <Col xs={3} key={idx}>
                        <Skeleton height={"335px"} width={"300px"} />
                      </Col>
                    );
                  })}
                </SkeletonTheme>
              </Then>
              <Else>
                <If condition={newsItems.length != 0} disableMemo >
                  <Then>
                    {newsItems.map((item) => {
                      return (
                        <Col xs={3} key={item.id}>
                          <NewsCard data={item} />
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
            
            <If condition={newsQuery?.data?.totalPages > 1}  >
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={newsQuery?.data?.totalPages || 0}
                    activeClassName="active"
                    breakClassName="page-item"
                    pageClassName={"page-item"}
                    breakLinkClassName="page-link"
                    nextLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    nextClassName={"page-item next"}
                    previousLinkClassName={"page-link"}
                    previousClassName={"page-item prev"}
                    onPageChange={(page) =>
                      setPagination({ ...pagination, page: page.selected + 1 })
                    }
                    // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
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
    </NewsWarper>
  );
}
