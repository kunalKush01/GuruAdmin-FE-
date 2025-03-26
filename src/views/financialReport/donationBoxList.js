import React, { useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllBoxCollection } from "../../api/donationBoxCollectionApi";
import DonationBoxListTable from "../../components/DonationBox/donationBoxListTable";
import NoContent from "../../components/partials/noContent";
import "../../../assets/scss/viewCommon.scss";
export default function Expenses() {
  const { t } = useTranslation();
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

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
  const [selectedMasterCate, setSelectedMasterCate] = useState("");

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

  const boxCollectionQuery = useQuery(
    [
      "Collections",
      pagination.page,
      selectedLang.id,
      filterEndDate,
      filterStartDate,
      searchBarValue,
    ],
    () =>
      getAllBoxCollection({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const categoryItems = useMemo(
    () => boxCollectionQuery?.data?.results ?? [],
    [boxCollectionQuery]
  );

  return (
    <div className="listviewwrapper">
      <div className="window nav statusBar body "></div>

      <div>
        <div style={{ height: "10px" }}>
          <If condition={boxCollectionQuery.isFetching}>
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
            <If condition={boxCollectionQuery.isLoading} disableMemo>
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
                    <DonationBoxListTable data={categoryItems} />
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

            <If condition={boxCollectionQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={boxCollectionQuery?.data?.totalPages || 0}
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
    </div>
  );
}
