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
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../../api/categoryApi";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { CategoryListTable } from "../../../components/categories/categoryListTable";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { CustomReactSelect } from "../../../components/partials/customReactSelect";
import NoContent from "../../../components/partials/noContent";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import { WRITE } from "../../../utility/permissionsVariable";
import "../../../assets/scss/viewCommon.scss";
export default function Category() {
  const { t } = useTranslation();
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  // master category
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
  const newTypes = [{ id: "", name: t("All") }, ...categoryTypeItem];

  let newId;
  newTypes.forEach((masterCategoryObject) => {
    if (masterCategoryObject.name == dropDownName) {
      newId = masterCategoryObject.id;
    }
  });
  const [categoryId, setCategoryId] = useState();

  const categoryQuery = useQuery(
    [
      "Categories",
      newId,
      pagination.page,
      pagination.limit,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getAllCategories({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
        masterId: newId,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const categoryItems = useMemo(
    () => categoryQuery?.data?.results ?? [],
    [categoryQuery]
  );
  const totalItems = useMemo(
    () => categoryQuery?.data?.totalResults ?? [],
    [categoryQuery]
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
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Category</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-sm-0">
            {/* <img
              src={arrowLeft}
              className="me-2  cursor-pointer"
              onClick={() => navigate("/")}
            /> */}
            <div className="addAction">
              <div className="">
                <div>
                  <Trans i18nKey={"categories_latest_Category"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction gap-1 justify-content-between">
            <ChangeCategoryType
              className={"  "}
              categoryTypeArray={newTypes}
              typeName={ConverFirstLatterToCapital(dropDownName)}
              setTypeName={(e) => {
                setCategoryId(e.target.id);
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/configuration/categories?page=${1}&filter=${e.target.name}`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addAction-btn"
                onClick={() =>
                  navigate(
                    `/configuration/categories/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"categories_AddCategory"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={categoryQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="categoryContent  ">
          <Row>
            <If condition={categoryQuery?.isLoading} disableMemo>
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
                    <div className="mb-2">
                      <CategoryListTable
                        data={categoryItems}
                        page={pagination}
                        allPermissions={allPermissions}
                        subPermission={subPermission}
                        currentFilter={routFilter}
                        // currentPage={routPagination}
                        totalItems={totalItems}
                        currentPage={pagination.page}
                        pageSize={pagination.limit}
                        onChangePage={(page) =>
                          setPagination((prev) => ({ ...prev, page }))
                        }
                        onChangePageSize={(pageSize) =>
                          setPagination((prev) => ({
                            ...prev,
                            limit: pageSize,
                            page: 1,
                          }))
                        }
                      />
                    </div>
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("category_not_found")}
                      para={t("category_not_click_add_category")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            {/* <If condition={categoryQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={categoryQuery?.data?.totalPages || 0}
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
                        `/configuration/categories?page=${
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
          </Row>
        </div>
      </div>
    </div>
  );
}
