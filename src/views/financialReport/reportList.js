import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllCommitments } from "../../api/commitmentApi";
import { getAllDonation } from "../../api/donationApi";
import { getAllBoxCollection } from "../../api/donationBoxCollectionApi";
import { getAllExpense } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import ReportListTable from "../../components/financeReport/reportListTable";
import BtnPopover from "../../components/partials/btnPopover";
import CustomDatePicker from "../../components/partials/customDatePicker";
import NoContent from "../../components/partials/noContent";
import FinancialReportTabs from "./financialReportTabs";
import FormikRangeDatePicker from "../../components/partials/FormikRangeDatePicker";
import { Formik } from "formik";
import { useUpdateEffect } from "react-use";
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
    /* height: 350px;
    overflow: auto; */
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    margin-top: .5rem;
    font: normal normal bold 13px/5px noto sans;
  }
  .dateChooserReport{
    border: 1px solid #FF8744;
    color: #FF8744;
    font: normal normal bold 15px/20px noto sans;
    /* padding: .4rem 1rem .4rem 2rem ; */
    padding: .5rem 1.5rem;
    border-radius: 7px;
 }
`;

  

export default function FinancialReport() {
  const [reportDate, setreportDate] = useState({start:new Date,end:new Date(moment().startOf("year"))});
  

  const { t } = useTranslation();
  const [activeReportTab, setActiveReportTab] = useState({ id: 1, name: t("report_expences") });

  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
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

  
  

  const expensesQuery = useQuery(
    ["Expenses", pagination.page, selectedLang.id,reportDate.start,reportDate.end],
    () =>
      getAllExpense({
        ...pagination,
        startDate: moment(reportDate.start)        
        .utcOffset(0, true)
        .toISOString(),
        endDate: moment(reportDate.end)        
        .utcOffset(0, true)
        .toISOString(),
        languageId: selectedLang.id,
        
      }),
    {
      keepPreviousData: true,
      enabled:activeReportTab.name==t("report_expences")
    }
  );
  const donationQuery = useQuery(
    ["donations", pagination.page, selectedLang.id,reportDate.end,reportDate.start],
    () =>
      getAllDonation({
        ...pagination,
        startDate: moment(reportDate.start)        
        .utcOffset(0, true)
        .toISOString(),
        endDate: moment(reportDate.end)        
        .utcOffset(0, true)
        .toISOString(),
        languageId: selectedLang.id,
        
      }),
    {
      keepPreviousData: true,
      enabled:activeReportTab.name==t("donation_Donation")
    }
  );
  const commitmentQuery = useQuery(
    [
      "Commitments",
      pagination.page,
      selectedLang.id,
      reportDate.end,
      reportDate.start,
    ],
    () =>
      getAllCommitments({
        ...pagination,
        startDate: moment(reportDate.start)        
        .utcOffset(0, true)
        .toISOString(),
        endDate: moment(reportDate.end)        
        .utcOffset(0, true)
        .toISOString(),
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
      enabled:activeReportTab.name==t("report_commitment")
    }
  );

  const boxCollectionQuery = useQuery(
    ["Collections", pagination.page, selectedLang.id,reportDate.start,reportDate.end],
    () =>
      getAllBoxCollection({
        ...pagination,
        startDate: moment(reportDate.start)        
        .utcOffset(0, true)
        .toISOString(),
        endDate: moment(reportDate.end)        
        .utcOffset(0, true)
        .toISOString(),
        languageId: selectedLang.id,
        
      }),
    {
      keepPreviousData: true,
      enabled:activeReportTab.name==t("report_donation_box")
    }
    );
    
    
    const Items = useMemo(
      () =>{
        switch (activeReportTab.name) {
          case t("report_expences"):
            return expensesQuery?.data ?? [];
            
            case t("donation_Donation"):
              return donationQuery?.data ?? [];
              
              case t("report_commitment"):
          return commitmentQuery?.data ?? [];
          
          case t("report_donation_box"):
            
            return boxCollectionQuery?.data ?? [];
            default:
              return [];
            }
          } ,
          [expensesQuery,donationQuery,commitmentQuery,boxCollectionQuery]
          );
          
          useEffect(()=>{
            setPagination({ page: 1, limit: 10 });
          },[activeReportTab.name])
          console.log("pagination",pagination.page);
          return (
            <NewsWarper>
      <div className="window nav statusBar body "></div>

      <div>
      <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-end"
              onClick={() => history.push("/")}
              />
            <div className="addNews">
              <div className="">
                <div>
                  <Trans i18nKey={"report_AddReport"} />
                </div>
                {/* <div className="filterPeriod">
                  <span>
                  {reportDate.start} - {reportDate.end}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="addNews">
            <div className="dateChooserReport d-flex position-relative justify-content-between align-item-center">
              {/* <div className="align-self-center">
                {reportStartDatePrint}&nbsp;&nbsp; - &nbsp;&nbsp;{reportEndDatePrint}
              </div> */}
              <Formik
              initialValues={{DateTime:{start:new Date(moment().startOf("year")),end:new Date()}}}
              
              >
                {(formik)=>
                {
                  useUpdateEffect(()=>{
                    setreportDate(formik.values.DateTime)
                  },[formik.values.DateTime])
                  return(<FormikRangeDatePicker
                    // label={t("donation_select_date_time")}
                    name="DateTime"
                    inline={false}
                    dateFormat=" dd-MM-yyyy"
                    selectsRange
                    />)}}

              </Formik>
              <div>
                <img src={editIcon} width={30} id={`popover`} className="align-self-center position-absolute cursor-pointer" style={{right:"2rem"}}/>
              </div>
            </div>
          </div>
        </div>
              
            
        <FinancialReportTabs setActive={setActiveReportTab} active={activeReportTab} setPagination={setPagination} />  
        <div style={{ height: "10px" }}>
          <If condition={expensesQuery.isFetching || donationQuery.isFetching ||commitmentQuery.isFetching}>
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
            <If condition={expensesQuery.isFetching || donationQuery.isFetching ||commitmentQuery.isFetching} disableMemo>
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
                <If condition={Items?.results?.length != 0} disableMemo>
                  <Then>
                    <ReportListTable  activeReportTab={activeReportTab} data={Items?.results??[]} page={pagination}/>
                  </Then>
                  <Else>
                  <NoContent 
                      headingNotfound={t("donation_box_not_found")}
                      para={t("donation_box_not_click_add_donation_box")}
                    />
                  </Else>
                </If>
              </Else>
            </If>
              
            {/* <If condition={Items.totalPages > 1} > */}
              {/* <Then  > */}
                {Items.totalPages > 1&&<Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={Items.totalPages?? 0}
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
                    forcePage={pagination.page-1}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                    
                    />
                </Col>}
              {/* </Then> */}
            {/* </If> */}
          </Row>
        </div>
      </div>
      
    </NewsWarper>
  );
}
