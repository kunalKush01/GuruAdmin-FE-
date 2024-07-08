import React, { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import NoContent from "../../../components/partials/noContent";
import { getAllMasters } from "../../../api/masterApi";
import { MasterListTable } from "../../../components/Masters/mastersListTable";

const CategoryListWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  // .ImagesVideos {
  //   font: normal normal bold 15px/33px Noto Sans;
  // }
  .addCategory {
    color: #583703;
    display: flex;
    align-items: center;
  }

  // .FormikWraper {
  //   padding: 40px;
  // }
  // .btn-Published {
  //   text-align: center;
  // }
  .addCategory-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .categoryContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  // .filterPeriod {
  //   color: #ff8744;
  //   font: normal normal bold 13px/5px noto sans;
  // }
`;

export default function Master() {
  const { t } = useTranslation();
  const history = useHistory();

  const masterQuery = useQuery(["Masters"], () => getAllMasters(), {
    keepPreviousData: true,
  });

  const masterItem = useMemo(
    () => masterQuery?.data?.masterNames ?? [],
    [masterQuery]
  );

  return (
    <CategoryListWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Masters</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-sm-0">
            <div className="addCategory">
              <div className="">
                <div>
                  <Trans i18nKey={"masters_list"} />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="addCategory justify-content-between">
            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={newTypes}
              typeName={ConverFirstLatterToCapital(dropDownName)}
              setTypeName={(e) => {
                setCategoryId(e.target.id);
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(
                  `/configuration/categories?page=${1}&filter=${e.target.name}`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className="addCategory-btn"
                onClick={() =>
                  history.push(
                    `/configuration/categories/add?page=${pagination.page}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"masters_list"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div> */}
        </div>
        <div style={{ height: "10px" }}>
          <If condition={masterQuery.isFetching}>
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
            <If condition={masterQuery?.isLoading} disableMemo>
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
                <If condition={masterItem.length != 0} disableMemo>
                  <Then>
                    <div className="mb-2">
                      <MasterListTable
                        data={masterItem}
                        // page={pagination}
                        // allPermissions={allPermissions}
                        // subPermission={subPermission}
                        // currentFilter={routFilter}
                        // currentPage={routPagination}
                      />
                    </div>
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("masters_not_found")}
                      //   para={t("category_not_click_add_category")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            {/* <If condition={masterItem.length > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    // pageCount={masterQuery?.data?.totalPages || 0}
                    activeClassName="active"
                    // initialPage={
                    //   parseInt(searchParams.get("page"))
                    //     ? parseInt(searchParams.get("page")) - 1
                    //     : pagination.page - 1
                    // }
                    breakClassName="page-item"
                    pageClassName={"page-item"}
                    breakLinkClassName="page-link"
                    nextLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    nextClassName={"page-item next"}
                    previousLinkClassName={"page-link"}
                    previousClassName={"page-item prev"}
                    // onPageChange={(page) => {
                    //   setPagination({ ...pagination, page: page.selected + 1 });
                    //   history.push(
                    //     `/configuration/categories?page=${
                    //       page.selected + 1
                    //     }&filter=${dropDownName}`
                    //   );
                    // }}
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
    </CategoryListWrapper>
  );
}
