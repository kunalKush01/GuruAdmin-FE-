import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import NoContent from "../../../components/partials/noContent";
import { getMasterDataById } from "../../../api/masterApi";
import { useParams, useHistory } from "react-router-dom";
import "./masterStyle.css";
import AddMaster from "./addMaster";
import { Plus } from "react-feather";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { MasterANTDTable } from "../../../components/Masters/masterANTDTable";

const MasterDataWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .masterContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .sticky-header {
    position: fixed;
    top: 130px !important;
    left: 0 !important;
    width: 100%;
    background-color: white;
    z-index: 1000;
    padding: 20px 50px 10px 30px;
    @media (max-width: 768px) {
      top: 75px !important;
      left: 0 !important;
      width: 100% !important;
      padding: 15px 30px;
    }
    @media (max-width: 480px) {
      top: 75px !important;
      left: 0 !important;
      width: 100% !important;
      padding: 15px 30px;
    }
    @media (max-width: 1024px) and (min-width: 768px) {
      top: 75px !important;
      left: 0 !important;
      width: 100% !important;
      padding: 15px 30px;
    }
    @media (max-width: 1200px) and (min-width: 768px) {
      top: 75px !important;
      left: 0 !important;
      width: 100% !important;
      padding: 15px 40px;
    }
  }
`;

export default function Master() {
  const { masterId } = useParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const history = useHistory();
  const handleRowSuccess = (load) => {
    setLoadingData(load);
    queryClient.invalidateQueries(["Masters-Data"]);
  };
  const masterDataQuery = useQuery(
    ["Masters-Data", masterId],
    () => getMasterDataById(masterId),
    {
      keepPreviousData: true,
    }
  );

  const masterItem = useMemo(
    () => masterDataQuery?.data ?? [],
    [masterDataQuery, setLoadingData]
  );

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  const handleFormSubmit = (data) => {
    // console.log("Form submitted:", data);
  };

  return (
    <MasterDataWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Masters</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="sticky-header d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div>
              <img
                src={arrowLeft}
                className="me-1 cursor-pointer"
                onClick={() => history.push(`/configuration/masters`)}
              />
              <Trans i18nKey={"masters_list"} />
            </div>
            <div>
              <Button className="" id="addBtn" onClick={toggleForm}>
                <Plus
                  className=""
                  size={15}
                  strokeWidth={4}
                  style={{ marginRight: "5px" }}
                />
                Add
              </Button>
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
        <div className="masterContent mt-0">
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
                    <div className="mt-3">
                      {/* <MasterDataTable
                        data={masterItem}
                        loadingRow={loadingData}
                        // page={pagination}
                        // allPermissions={allPermissions}
                        // subPermission={subPermission}
                        // currentFilter={routFilter}
                        // currentPage={routPagination}
                      /> */}
                      <MasterANTDTable
                        data={masterItem}
                        loadingRow={loadingData}
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
      <AddMaster
        schema={Object.values(masterDataQuery.data?.schema || {})}
        isOpen={isFormOpen}
        toggle={toggleForm}
        onSubmit={handleFormSubmit}
        masterId={masterId}
        masterItem={masterItem}
        onSuccess={handleRowSuccess}
      />
    </MasterDataWrapper>
  );
}
