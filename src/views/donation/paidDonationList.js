import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { getAllPaidDonations } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PaidDonationTable from "../../components/donation/paidDonationTable";
import NoContent from "../../components/partials/noContent";

import "../../assets/scss/viewCommon.scss";

export default function PaidDonationList() {
  const selectedLang = useSelector((state) => state.auth.selectLang);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { commitmentId } = useParams();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentStatus = searchParams.get("status");

  const paidDonationListQuery = useQuery(
    ["categoryTypes"],
    () => getAllPaidDonations(commitmentId),
    {
      keepPreviousData: true,
    }
  );
  const paidDonationItems = useMemo(
    () => paidDonationListQuery?.data?.results ?? [],
    [paidDonationListQuery]
  );
  return (
    <div className="listviewwrapper">
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2 cursor-pointer align-self-center"
              onClick={() =>
                navigate(
                  `/commitment?page=${currentPage}&category=${currentCategory}&subCategory=${currentSubCategory}&status=${currentStatus}&filter=${currentFilter}`
                )
              }
            />
            <div className="addAction">
              <div className="">
                <div>
                  <Trans i18nKey={"donation_Donation"} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={paidDonationListQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="donationContent  ">
          <Row>
            <If condition={paidDonationListQuery.isLoading} disableMemo>
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
                <If condition={paidDonationItems.length != 0} disableMemo>
                  <Then>
                    <PaidDonationTable data={paidDonationItems} />
                  </Then>
                  <Else>
                    <NoContent headingNotfound={t("donation_paid_not_found")} />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={paidDonationListQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={paidDonationListQuery?.data?.totalPages || 0}
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
                        `/donation?page=${
                          page.selected + 1
                        }&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                      );
                    }}
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
