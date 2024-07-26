import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Button, Col, Row } from "reactstrap";
import NoContent from "../../../components/partials/noContent";
import { getMasterDataById } from "../../../api/masterApi";
import { useParams, useHistory } from "react-router-dom";
import AddMaster from "./addMaster";
import { Plus } from "react-feather";
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { MasterANTDTable } from "../../../components/Masters/masterANTDTable";
import "../../../assets/scss/common.scss";

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

  const handleFormSubmit = (data) => {};

  return (
    <div className="masterContent">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Masters</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="masterDataList_sticky-header  d-sm-flex justify-content-between align-items-center ">
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
                    <div className="mt-3 masterDataListAntdTable">
                      <MasterANTDTable
                        data={masterItem}
                        loadingRow={loadingData}
                      />
                    </div>
                  </Then>
                  <Else>
                    <NoContent headingNotfound={t("masters_not_found")} />
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
    </div>
  );
}
