import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import { Helmet } from "react-helmet";
import { getAllBoxCollection } from "../../api/donationBoxCollectionApi";
import BoxListCard from "../../components/DonationBox/BoxListCard.js";
import NoContent from "../../components/partials/noContent";
import { WRITE } from "../../utility/permissionsVariable";
import "../../assets/scss/viewCommon.scss";
import { Card, Pagination } from "antd";

export default function Expenses() {
  const [dropDownName, setdropDownName] = useState(t("All"));
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
  const { t } = useTranslation();
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
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

  const [selectedMasterCate, setSelectedMasterCate] = useState("");

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

  const boxCollectionQuery = useQuery(
    [
      "Collections",
      currentpage,
      pageSize,
      selectedLang.id,
      filterStartDate,
      filterEndDate,
      searchBarValue,
    ],
    () => getAllBoxCollection(getQueryParams()),
    {
      keepPreviousData: true,
    }
  );

  const collectionItems = useMemo(
    () => boxCollectionQuery?.data?.results ?? [],
    [boxCollectionQuery]
  );
  const totalItems = useMemo(
    () => boxCollectionQuery?.data?.totalResults ?? [],
    [boxCollectionQuery]
  );
  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName?.name === "hundi"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Donation Box</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addAction d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"DonationBox_DonationBox"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction  d-flex flex-wrap gap-2 gap-md-0">
            <div className="total_collection me-2 d-flex justify-content-center align-items-center ">
              <Trans i18nKey={"DonationBox_total_collection"} />
              &nbsp;
              <div>₹</div>
              <div>
                {boxCollectionQuery?.data?.totalAmount?.toLocaleString(
                  "en-IN"
                ) ?? 0}
              </div>
            </div>
            <ChangePeriodDropDown
              className={"me-2"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(`/hundi?page=${1}&filter=${e.target.name}`);
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn "
                onClick={() =>
                  history.push(
                    `/hundi/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"DonationBox_AddCollectionBox"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
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
        <div className="newsContent">
          <Col>
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
                <If condition={collectionItems.length != 0} disableMemo>
                  <Then>
                    <Row className="pe-0" style={{marginBottom:"100px"}}>
                      {collectionItems.map((item, idx) => {
                        return (
                          <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                            <BoxListCard
                              key={item.id}
                              data={item}
                              allPermissions={allPermissions}
                              subPermission={subPermission}
                              currentFilter={routFilter}
                              currentPage={routPagination}
                            />
                          </Col>
                        );
                      })}
                    </Row>
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
            {/* <If condition={boxCollectionQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={boxCollectionQuery?.data?.totalPages || 0}
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
                        `/hundi?page=${
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
            </If> */}
          </Col>
        </div>
      </div>
    </div>
  );
}
