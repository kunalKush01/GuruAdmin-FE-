import React, { useMemo, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import NoContent from "../../../components/partials/noContent";
import { getAllMasters } from "../../../api/masterApi";
import { MasterListTable } from "../../../components/Masters/mastersListTable";
import { Plus } from "react-feather";
import AddMasterForm from "./addMasterForm";
import '../../../assets/scss/common.scss'
import { useSelector } from "react-redux";
import { WRITE } from "../../../utility/permissionsVariable";


export default function Master() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const masterQuery = useQuery(
    ["Masters", pagination.current, pagination.pageSize],
    () =>
      getAllMasters({
        current: pagination.current,
        pageSize: pagination.pageSize,
      }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
        }));
      },
    }
  );
  const masterItem = useMemo(
    () => masterQuery?.data?.masterNames ?? [],
    [masterQuery]
  );
  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  };

  const handlePageSizeChange = (pageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      current: 1, 
    }));
  };
  const queryClient = useQueryClient();
  const toggleForm = () => setIsFormOpen(!isFormOpen);
  const handleFormSuccess = () => {
    queryClient.invalidateQueries(["Masters"]);
  };

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
    <div className="masterlistTableContainer">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Masters</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="sticky-header d-sm-flex justify-content-between align-items-center ">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <div>
              <Trans i18nKey={"masters_list"} />
            </div>
            <div>
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button className="" id="addBtn" onClick={toggleForm}>
                <Plus
                  className=""
                  size={15}
                  strokeWidth={4}
                  style={{ marginRight: "5px" }}
                />
                {t("add")}
              </Button>
              ) : (
                ""
              )}
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
                    <div className="mb-2 masterListAntdTable">
                      <MasterListTable
                        data={masterItem}
                        pagination={pagination}
                        onChangePage={handlePageChange}
                        onChangePageSize={handlePageSizeChange}
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
      <AddMasterForm
        isOpen={isFormOpen}
        toggle={toggleForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
