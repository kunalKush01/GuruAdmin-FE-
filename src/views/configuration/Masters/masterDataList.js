import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import NoContent from "../../../components/partials/noContent";
import { getMasterDataById } from "../../../api/masterApi";
import { useParams } from "react-router-dom";
import { MasterDataTable } from "../../../components/Masters/masterDataTable";

const MasterDataWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .addCategory {
    color: #583703;
    display: flex;
    align-items: center;
  }

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
`;

export default function Master() {
  const { masterId } = useParams();

  const { t } = useTranslation();

  const masterDataQuery = useQuery(
    ["Masters-Data", masterId],
    () => getMasterDataById(masterId),
    {
      keepPreviousData: true,
    }
  );

  const masterItem = useMemo(
    () => masterDataQuery?.data ?? [],
    [masterDataQuery]
  );

  return (
    <MasterDataWrapper>
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
        </div>
        <div style={{ height: "10px" }}>
          <If condition={masterDataQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="categoryContent">
          <Row>
            <If condition={masterDataQuery?.isLoading} disableMemo>
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
                      <MasterDataTable
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
    </MasterDataWrapper>
  );
}
