import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";

import styled from "styled-components";
import { CustomDropDown } from "../../../components/partials/customDropDown";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import { createNews, getAllNews } from "../../../api/newsApi";
import NewsCard from "../../../components/news/newsCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Plus } from "react-feather";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NoNews from "../../../components/partials/noContent";
import { If, Then, Else } from "react-if-else-switch";
import { useSelector } from "react-redux";
import AsyncSelectField from "../../../components/partials/asyncSelectField";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../../api/categoryApi";
import { CustomReactSelect } from "../../../components/partials/customReactSelect";
import CategoryCard from "../../../components/categories/categoryCard";
import {
  SubAdminUserListTable,
  UserListTable,
} from "../../../components/users/userListTable";
import { getAllUser, getAllUserRoles } from "../../../api/userApi";
import NoContent from "../../../components/partials/noContent";
import { WRITE } from "../../../utility/permissionsVariable";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { timers } from "jquery";
import "../../../assets/scss/viewCommon.scss";
const randomArray = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function User() {
  const { t } = useTranslation();
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
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("page");
  const routPagination = pagination.page;
  useEffect(() => {
    if (currentPage || currentFilter) {
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

  const [selectedMasterCate, setSelectedMasterCate] = useState("");

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

  const userQuery = useQuery(
    [
      "Users",
      pagination.page,
      selectedLang.id,
      selectedMasterCate,
      searchBarValue,
    ],
    () =>
      getAllUser({
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

  const userRoleQuery = useQuery(
    ["userRoles", selectedLang.id],
    async () =>
      await getAllUserRoles({
        languageId: selectedLang.id,
      })
  );
  const userRolesItems = useMemo(
    () => userRoleQuery?.data?.results ?? [],
    [userRoleQuery]
  );

  const userItems = useMemo(() => userQuery?.data?.results ?? [], [userQuery]);

  const masterloadOptionQuery = useQuery(
    ["MasterCategory", selectedLang.id],
    async () =>
      await getAllMasterCategories({
        languageId: selectedLang.id,
      })
  );
  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "configuration"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Users</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-flex justify-content-between align-items-center ">
          <div className="d-flex justify-content-between align-items-center ">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer"
              onClick={() => navigate("/")}
            /> */}
            <div className="addNews">
              <div className="">
                <div>
                  <Trans i18nKey={"users_latest_User"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addNews">
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn"
                onClick={() =>
                  userRolesItems?.length > 0
                    ? navigate(
                        `/configuration/users/add?page=${pagination.page}`
                      )
                    : Swal.fire({
                        icon: "info",
                        title: "Sorry",
                        text: "It seems that the Super admin hasn't assigned any Roles for the Sub-user, which is why you're unable to add them.",
                        showConfirmButton: false,
                        timer: 2000,
                      })
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"users_AddUser"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={userQuery.isFetching}>
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
            <If condition={userQuery.isLoading} disableMemo>
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
                <If condition={userItems.length != 0} disableMemo>
                  <Then>
                    <SubAdminUserListTable
                      data={userItems}
                      currentPage={routPagination}
                      allPermissions={allPermissions}
                      subPermission={subPermission}
                    />
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("users_not_found")}
                      para={t("users_not_click_add_users")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={userQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={userQuery?.data?.totalPages || 0}
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
                        `/configuration/users?page=${page.selected + 1}`
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
