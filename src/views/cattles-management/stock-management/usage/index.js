import React from "react";

import { useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";

import NoContent from "../../../../components/partials/noContent";
import UsageTable from "./table";
import { Helmet } from "react-helmet";
import "../../../../assets/scss/common.scss";

const Usage = ({
  list,
  query,
  pagination,
  setPagination,
  dropDownName,
  allPermissions,
  subPermission,
  searchParams,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Cattles Stock Management | Usage </title>
      </Helmet>

      <div style={{ height: "10px" }}>
        <If condition={query.isFetching}>
          <Then>
            <Skeleton
              baseColor="#ff8744"
              highlightColor="#fff"
              height={"3px"}
            />
          </Then>
        </If>
      </div>
      <div className="">
        <Row>
          <If
            condition={
              !query.isLoading && list.length != 0 && !query.isFetching
            }
            disableMemo
          >
            <Then>
              <UsageTable
                data={list}
                currentFilter={dropDownName}
                // currentPage={pagination.page}
                height="160px"
                allPermissions={allPermissions}
                subPermission={subPermission}
                // maxHeight="220px"
                // allPermissions={allPermissions}
                // subPermission={subPermission}
                totalItems={totalItems}
                currentPage={currentPage}
                pageSize={pageSize}
                onChangePage={onChangePage}
                onChangePageSize={onChangePageSize}
              />
            </Then>
            <Else>
              <If condition={!query.isLoading && list.length == 0} disableMemo>
                <Then>
                  <NoContent
                    headingNotfound={t("no_data_found")}
                    para={t("no_data_found_add_data")}
                  />
                </Then>
              </If>
            </Else>
          </If>

          {/* <If condition={query?.data?.totalPages > 1}>
            <Then>
              <Col xs={12} className="mb-2 d-flex justify-content-center">
                <ReactPaginate
                  nextLabel=""
                  forcePage={pagination.page - 1}
                  breakLabel="..."
                  previousLabel=""
                  pageCount={query?.data?.totalPages || 0}
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
                      `/stock-management/usage?page=${
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
    </>
  );
};

export default Usage;
