import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import {
  getCattlesItemsList,
  getCattlesStockList,
  getSupplyList,
} from "../../../api/cattle/cattleStock";
import { getCattlesUsageList } from "../../../api/cattle/cattleUsage";
import CattleTabBar from "../../../components/cattleTabBar";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import Items from "./items";
import Stocks from "./stock";
import Supplies from "./supplies";
import Usage from "./usage";
import { Helmet } from "react-helmet";
import { WRITE } from "../../../utility/permissionsVariable";

const StockManagementWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .btn {
    font-weight: bold;
  }

  hr {
    height: 1px;
    margin-top: 0;
  }
`;

const StockManagement = () => {
  const [active, setActive] = useState(location.pathname);
  const history = useHistory();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    if (currentPage || currentFilter) {
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

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

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const cattleStockManagementList = useQuery(
    [
      "cattleStockManagementList",
      filterStartDate,
      filterEndDate,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      active == "/cattle/management/stock"
        ? getCattlesStockList({
            ...pagination,
            search: searchBarValue,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,
          })
        : active == "/cattle/management/item"
        ? getCattlesItemsList({
            ...pagination,
            search: searchBarValue,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,
          })
        : active == "/cattle/management/supplies"
        ? getSupplyList({
            ...pagination,
            search: searchBarValue,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,
          })
        : active == "/cattle/management/usage" &&
          getCattlesUsageList({
            ...pagination,
            search: searchBarValue,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,
          })
  );

  const cattleStockManagementListData = useMemo(
    () => cattleStockManagementList?.data?.results ?? [],
    [cattleStockManagementList]
  );

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );

  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  console.log("allPermissions", allPermissions);
  const subPermissions = permissions?.find((permissionName) => {
    if (active === "/cattle/management/item") {
      return permissionName.name == "cattle-item";
    } else if (active === "/cattle/management/supplies") {
      return permissionName.name == "cattle-supplies";
    } else if (active === "/cattle/management/usage") {
      return permissionName.name == "cattle-usage";
    } else return false;
  });

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  console.log("subPermission", permissions);

  return (
    <StockManagementWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharam Admin | Cattles Stock Management | Stock </title>
      </Helmet>

      <div>
        <div className="relative">
          <div className="d-sm-flex  justify-content-between align-items-center ">
            {/* <Trans i18nKey="cattle_stock" /> */}
            <CattleTabBar
              tabs={[
                {
                  name: "Stock",
                  url:
                    allPermissions?.name === "all"
                      ? "/cattle/management/stock"
                      : "/cattle/management",
                  active: "/cattle/management/stock",
                  permissionKey: ["cattle-stock"],
                  isManagment: true,
                },
                {
                  name: "Supplies",
                  url:
                    allPermissions?.name === "all"
                      ? "/cattle/management/supplies"
                      : "/cattle/management",

                  active: "/cattle/management/supplies",
                  permissionKey: ["cattle-supplies"],
                  isManagment: true,
                },
                {
                  name: "Usage",
                  url:
                    allPermissions?.name === "all"
                      ? "/cattle/management/usage"
                      : "/cattle/management",

                  active: "/cattle/management/usage",
                  permissionKey: ["cattle-usage"],
                  isManagment: true,
                },
                {
                  name: "Items",
                  url:
                    allPermissions?.name === "all"
                      ? "/cattle/management/item"
                      : "/cattle/management",

                  active: "/cattle/management/item",
                  permissionKey: ["cattle-item"],
                  isManagment: true,
                },
              ]}
              active={active}
              setActive={setActive}
              tabBar
            />
            <div className="d-flex  mt-sm-0 justify-content-between">
              <ChangePeriodDropDown
                className={"me-1"}
                dropDownName={dropDownName}
                setdropDownName={(e) => {
                  setdropDownName(e.target.name);
                  setPagination({ page: 1 });
                  history.push(
                    `/${
                      active == "/cattle/management/stock"
                        ? "cattle/management/stock"
                        : active == "/cattle/management/item"
                        ? "cattle/management/item"
                        : active == "/cattle/management/supplies"
                        ? "cattle/management/supplies"
                        : active == "/cattle/management/usage"
                        ? "cattle/management/usage"
                        : "/not-fount"
                    }?page=${1}&filter=${e.target.name}`
                  );
                }}
              />
              {/* { ? ():("")} */}

              {allPermissions?.name === "all" ||
              subPermission?.includes(WRITE) ? (
                active == "/cattle/management/stock" ? (
                  ""
                ) : (
                  <Button
                    color="primary"
                    onClick={() =>
                      active == "/cattle/management/supplies"
                        ? history.push(
                            `/cattle/management/supplies/add?page=${pagination.page}&filter=${dropDownName}`
                          )
                        : active == "/cattle/management/item"
                        ? history.push(
                            `/cattle/management/item/add?page=${pagination.page}&filter=${dropDownName}`
                          )
                        : active == "/cattle/management/usage"
                        ? history.push(
                            `/cattle/management/usage/add?page=${pagination.page}&filter=${dropDownName}`
                          )
                        : "/not-found"
                    }
                  >
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                    <span>
                      <Trans
                        i18nKey={
                          active == "/cattle/management/supplies"
                            ? "cattle_supplies_add"
                            : active == "/cattle/management/item"
                            ? "cattle_items_add"
                            : active == "/cattle/management/usage" &&
                              "cattle_usage_add"
                        }
                      />
                    </span>
                  </Button>
                )
              ) : (
                ""
              )}
            </div>
          </div>
          <hr />
        </div>

        {active == "/cattle/management/stock" ? (
          <Stocks
            pagination={pagination}
            setPagination={setPagination}
            dropDownName={dropDownName}
            list={cattleStockManagementListData}
            query={cattleStockManagementList}
            searchParams={searchParams}
          />
        ) : active == "/cattle/management/item" ? (
          <Items
            pagination={pagination}
            setPagination={setPagination}
            allPermissions={allPermissions}
            subPermission={subPermission}
            dropDownName={dropDownName}
            searchParams={searchParams}
            list={cattleStockManagementListData}
            query={cattleStockManagementList}
          />
        ) : active == "/cattle/management/supplies" ? (
          <Supplies
            pagination={pagination}
            setPagination={setPagination}
            dropDownName={dropDownName}
            list={cattleStockManagementListData}
            allPermissions={allPermissions}
            subPermission={subPermission}
            query={cattleStockManagementList}
            searchParams={searchParams}
          />
        ) : (
          active == "/cattle/management/usage" && (
            <Usage
              pagination={pagination}
              setPagination={setPagination}
              dropDownName={dropDownName}
              list={cattleStockManagementListData}
              allPermissions={allPermissions}
              subPermission={subPermission}
              query={cattleStockManagementList}
              searchParams={searchParams}
            />
          )
        )}
      </div>
    </StockManagementWrapper>
  );
};

export default StockManagement;
