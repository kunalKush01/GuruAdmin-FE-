import React, { useMemo, useState } from "react";

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
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import NoContent from "../../components/partials/noContent";
import NotificationList from "../../components/Notification/notificationList";
import { getAllNotification } from "../../api/notification";
import { Helmet } from "react-helmet";
const NotificationWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNotification {
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
  .addNotification-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .notificationContent {
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

export default function Notification() {
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
  const [selectedMasterCate, setSelectedMasterCate] = useState("");

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  let startDate = moment(filterStartDate).format("DD MMM YYYY");
  //   let endDate = moment(filterEndDate).utcOffset(0).format("D MMM YYYY");
  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const notificationQuery = useQuery(
    [
      "Notifitions",
      pagination.page,
      selectedLang.id,
      selectedMasterCate,
      searchBarValue,
    ],
    () =>
      getAllNotification({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
        masterId: selectedMasterCate,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const NotificationsItem = useMemo(
    () => notificationQuery?.data?.results ?? [],
    [notificationQuery]
  );

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );

  return (
    <NotificationWarper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Notifications</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer"
              onClick={() => history.push("/")}
            />
            <div className="addNotification">
              <div className="">
                <div>
                  <Trans i18nKey={"notifications"} />
                </div>
                {/* <div className="filterPeriod">
                  <span>{startDate}</span>
                </div> */}
              </div>
            </div>
          </div>
          {/* <div className="addNotification">
            <Button
              color="primary"
              className="addNotification-btn"
              onClick={() => history.push("/notification/add")}
            >
              <span>
                <Plus className="me-1" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"notifications_Notify_Users"} />
              </span>
            </Button>
          </div> */}
        </div>
        <div style={{ height: "10px" }}>
          <If condition={notificationQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="notificationContent  ">
          <Row>
            <If condition={notificationQuery.isLoading} disableMemo>
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
                <If condition={NotificationsItem?.length != 0} disableMemo>
                  <Then>
                    <NotificationList data={NotificationsItem} />
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("notification_not_found")}
                      // para={t("subscribed_not_click_add")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={notificationQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={notificationQuery?.data?.totalPages || 0}
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
    </NotificationWarper>
  );
}
