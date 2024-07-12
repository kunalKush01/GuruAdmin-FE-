import React, { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import NoContent from "../../../components/partials/noContent";
import { getAllMasters } from "../../../api/masterApi";
import { MasterListTable } from "../../../components/Masters/mastersListTable";

const CategoryListWrapper = styled.div`
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
  const { t } = useTranslation();

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
                      />
                    </div>
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("masters_not_found")}
                    />
                  </Else>
                </If>
              </Else>
            </If>
          </Row>
        </div>
      </div>
    </CategoryListWrapper>
  );
}
