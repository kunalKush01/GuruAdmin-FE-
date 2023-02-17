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
import styled from "styled-components";
import { getAllDonation } from "../../api/donationApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationListTable from "../../components/donation/donationListTable";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { getAllMasterCategories } from "../../api/categoryApi";

const DoationWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addDonation {
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
  .addDonation-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .donationContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    margin-top: 0.5rem;
    font: normal normal bold 13px/5px noto sans;
  }
`;

export default function Donation() {
  const [categoryTypeName, setCategoryTypeName] = useState("All");
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
  const { t } = useTranslation();
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });


  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");


  useEffect(() => {
    if (currentPage || currentCategory ||currentFilter) {
      setCategoryTypeName(currentCategory);
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);


  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  let startDate = moment(filterStartDate).format("DD MMM");
  let endDate = moment(filterEndDate).utcOffset(0).format("DD MMM, YYYY");

  const categoryTypeQuery = useQuery(
    ["categoryTypes"],
    () =>
      getAllMasterCategories({
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );
  const categoryTypeItem = useMemo(
    () => categoryTypeQuery?.data?.results ?? [],
    [categoryTypeQuery]
  );
  const newTypes = [{ id: "", name: "All" }, ...categoryTypeItem];

  let newId;
  newTypes.forEach((newObeject) => {
    if (newObeject.name == categoryTypeName) {
      newId = newObeject.id;
    }
  });
  const [categoryId, setCategoryId] = useState();

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const donationQuery = useQuery(
    [
      "donations",
      pagination.page,
      selectedLang.id,
      newId,
      filterEndDate,
      filterStartDate,
      searchBarValue,
    ],
    () =>
      getAllDonation({
        search: searchBarValue,
        ...pagination,
        startDate: filterStartDate,
        masterId: newId,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );

  const donationItems = useMemo(
    () => donationQuery?.data?.results ?? [],
    [donationQuery]
  );
  return (
    <DoationWarper>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2 cursor-pointer align-self-end"
              onClick={() => history.push("/")}
            />
            <div className="addDonation">
              <div className="">
                <div>
                  <Trans i18nKey={"donation_Donation"} />
                </div>
                <div className="filterPeriod">
                  <span>
                    {startDate} - {endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="addDonation">
          <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={newTypes}
              typeName={categoryTypeName}
              setTypeName={(e) => {
                setCategoryId(e.target.id);
                setCategoryTypeName(e.target.name);
                setPagination({ page: 1 });
                history.push(`/donation?page=${1}&filter=${e.target.name}`);
              }}
            />
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name)
                setPagination({ page: 1 });
                history.push(`/donation?page=${1}&filter=${e.target.name}`);
              }}
            />
            <Button
              color="primary"
              className="addDonation-btn  "
              onClick={() => history.push(`/donation/add?page=${pagination.page}&category=${categoryTypeName}&filter=${dropDownName}`)}
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"donation_Adddonation"} />
              </span>
            </Button>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={donationQuery.isFetching}>
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
            <If condition={donationQuery.isLoading} disableMemo>
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
                <If condition={donationItems.length != 0} disableMemo>
                  <Then>
                    <DonationListTable data={donationItems}/>
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("donation_not_found")}
                      para={t("donation_not_click_add_donation")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={donationQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={donationQuery?.data?.totalPages || 0}
                    activeClassName="active"
                    initialPage={
                      (parseInt(searchParams.get("page"))
                        ? parseInt(searchParams.get("page")) - 1
                        : pagination.page - 1)
                    }
                    breakClassName="page-item"
                    pageClassName={"page-item"}
                    breakLinkClassName="page-link"
                    nextLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    nextClassName={"page-item next"}
                    previousLinkClassName={"page-link"}
                    previousClassName={"page-item prev"}
                    onPageChange={(page) =>
                      {
                      setPagination({ ...pagination, page: page.selected + 1 })
                      history.push(
                        `/donation?page=${
                          page.selected + 1
                        }&category=${categoryTypeName}&filter=${dropDownName}`
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
    </DoationWarper>
  );
}
