import React, { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import { getAllPunyarjak } from "../../api/punarjakApi";
import { getAllSubscribedUser } from "../../api/subscribedUser";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import PunyarjakCard from "../../components/Punyarjak/punyarjakCard";
import PunyarjakTable from "../../components/Punyarjak/punyarjakUserListTable";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import SubscribedUSerListTable from "../../components/subscribedUser/subscribedUserListTable";
import { WRITE } from "../../utility/permissionsVariable";

import '../../styles/viewCommon.scss';
;

export default function Punyarjak() {
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
  const routPagination = pagination.page;
  useEffect(() => {
    if (currentPage) {
      // setdropDownName(currentFilter);
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const punyarjakUsersQuery = useQuery(
    [
      "punyarjak",
      pagination.page,
      selectedLang.id,
      filterEndDate,
      filterStartDate,
      searchBarValue,
    ],
    () =>
      getAllPunyarjak({
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

  const punyarjakUsers = useMemo(
    () => punyarjakUsersQuery?.data?.results ?? [],
    [punyarjakUsersQuery]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "punyarjak"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <div className="punyarjakwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Punyarjak</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center">
            {/* <img
              src={arrowLeft}
              className="me-2 cursor-pointer align-self-center"
              onClick={() => history.push("/")}
            /> */}
            <div className="addPunyarjak">
              <div className="">
                <div>
                  <Trans i18nKey={"punyarjak"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addPunyarjak">
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addPunyarjak-btn"
                onClick={() =>
                  history.push(`/punyarjak/add?page=${pagination.page}`)
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"add_punyarjak"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={punyarjakUsersQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="punyarjakContent  ">
          <Row>
            <If condition={punyarjakUsersQuery.isLoading} disableMemo>
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
                <If condition={punyarjakUsers.length != 0} disableMemo>
                  <Then>
                    {punyarjakUsers?.map((item) => {
                      return (
                        <Col
                          xs={12}
                          md={6}
                          lg={3}
                          className="pe-sm-3 pe-0"
                          key={item.id}
                        >
                          <PunyarjakCard
                            data={item}
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
                      headingNotfound={t("punyarjak_not_found")}
                      para={t("punyarjak_not_click_add")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={punyarjakUsersQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    breakLabel="..."
                    previousLabel=""
                    pageCount={punyarjakUsersQuery?.data?.totalPages || 0}
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
