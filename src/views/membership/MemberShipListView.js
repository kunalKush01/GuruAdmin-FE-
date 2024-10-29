import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import MemberShipListTable from "../../components/membership/MemberShipListTable";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import { useHistory } from "react-router-dom";
import { getAllMembers } from "../../api/membershipApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { WRITE } from "../../utility/permissionsVariable";

function MemberShipListView() {
  const history = useHistory();
  const queryClient = useQueryClient();

  const permissions = useSelector((state) => state.auth.userDetail?.permissions);
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "membership" 
  );
  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data } = useQuery(
    ["memberShipListData", pagination.page, pagination.limit],
    () => getAllMembers({ ...pagination }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Membership</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addAction d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"membership"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction d-flex flex-wrap gap-2 gap-md-0">
          {(allPermissions?.name === "all" || subPermission?.includes(WRITE)) && (
              <Button
                className={`addAction-btn me-1`}
                color="primary"
                onClick={() => history.push(`/member/addMember`)}
              >
                Add
              </Button>
            )}

            <input type="file" accept="" className="d-none" />
          </div>
        </div>
        <div style={{ height: "10px" }}></div>
        <div className="commitmentContent">
          <Row>
            <MemberShipListTable
              data={data ? data.results : []}
              totalItems={data ? data.totalResults : 0}
              pageSize={pagination.limit}
              onChangePage={(page) => {
                setPagination((prev) => ({ ...prev, page }));
              }}
              onChangePageSize={(pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  limit: pageSize,
                  page: 1,
                }));
              }}
            />
          </Row>
        </div>
      </div>
    </div>
  );
}

export default MemberShipListView;
