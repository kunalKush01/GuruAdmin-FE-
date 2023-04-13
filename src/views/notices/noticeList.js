import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import FormikCustomDatePicker from "../../components/partials/formikCustomDatePicker";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Plus } from "react-feather";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { If, Then, Else } from "react-if-else-switch";
import { getAllNotices, getNoticeDates } from "../../api/noticeApi.js";
import NoticeCard from "../../components/notices/noticeCard";
import CustomDatePicker from "../../components/partials/customDatePicker";
import HinduCalenderDetailCard from "../../components/notices/hinduCalenderDetailCard";
import NoContent from "../../components/partials/noContent";
import { useSelector } from "react-redux";
import { WRITE } from "../../utility/permissionsVariable";
const NoticeWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNotice {
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
  .addNotice-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .noticeContent {
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
  .noContent {
    margin-left: 30rem;
  }
`;

const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function NoticeList() {
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
    limit: 12,
  });

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
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const noticeQuery = useQuery(
    [
      "Notices",
      pagination.page,
      startDate,
      endDate,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getAllNotices({
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

  const dateQuery = useQuery(["NoticeDates"], () => getNoticeDates());
  const NoticeDates = useMemo(() => {
    return dateQuery?.data?.results?.map((item) => moment(item).toDate()) ?? [];
  }, [dateQuery]);

  const NoticeItems = useMemo(
    () => noticeQuery?.data?.results ?? [],
    [noticeQuery]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "notices"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <NoticeWarper>
      <div className="window nav statusBar body "></div>
      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => history.push("/")}
            />
            <div className="addNotice">
              <div className="">
                <div>
                  <Trans i18nKey={"notices_latest_Notice"} />
                </div>
                {/* <div className="filterPeriod">
                  <span>
                    {startDate} - {endDate}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="addNotice">
            <ChangePeriodDropDown
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(`/notices?page=${1}&filter=${e.target.name}`);
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addNotice-btn"
                onClick={() =>
                  history.push(
                    `/notices/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"notices_AddNotice"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={noticeQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div>
          <Row className="w-100 m-0">
            <Col xs={9} className="noticeContent ps-0">
              <If condition={noticeQuery.isLoading} disableMemo>
                <Then>
                  <SkeletonTheme
                    baseColor="#FFF7E8"
                    highlightColor="#fff"
                    borderRadius={"10px"}
                  >
                    {randomArray.map((itm, idx) => {
                      return (
                        <Col xs={12} key={idx}>
                          <Skeleton height={"63px"} />
                        </Col>
                      );
                    })}
                  </SkeletonTheme>
                </Then>
                <Else>
                  <If condition={NoticeItems.length != 0} disableMemo>
                    <Then>
                      {NoticeItems.map((item) => {
                        return (
                          <Col xs={12} key={item.id} className={"p-0"}>
                            <NoticeCard
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
                      <div className="noContent">
                        <NoContent
                          headingNotfound={t("notices_not_found")}
                          para={t("notices_not_click_add_notices")}
                        />
                      </div>
                    </Else>
                  </If>
                </Else>
              </If>

              <If condition={noticeQuery?.data?.totalPages > 1}>
                <Then>
                  <Col xs={12} className="mb-2 d-flex justify-content-center">
                    <ReactPaginate
                      nextLabel=""
                      forcePage={pagination.page - 1}
                      breakLabel="..."
                      previousLabel=""
                      pageCount={noticeQuery?.data?.totalPages || 0}
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
                        setPagination({
                          ...pagination,
                          page: page.selected + 1,
                        });
                        history.push(
                          `/events?page=${
                            page.selected + 1
                          }&filter=${dropDownName}`
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
            </Col>
            <Col xs={3} className="p-0 ps-1 " style={{ marginTop: "1.8rem" }}>
              <Row>
                <Col xs={12}>
                  <If condition={dateQuery.isLoading}>
                    <Then>
                      <></>
                    </Then>
                    <Else>
                      <CustomDatePicker
                        disabledKeyboardNavigation
                        highlightDates={NoticeDates}
                      />
                    </Else>
                  </If>
                </Col>
              </Row>
              <Row className="w-100 m-0">
                <Col xs={12}>{/* <HinduCalenderDetailCard /> */}</Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </NoticeWarper>
  );
}
