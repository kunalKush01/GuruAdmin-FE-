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

import "../../../assets/scss/viewCommon.scss";
const StockManagement = () => {
  const [active, setActive] = useState(location.pathname);
  const history = useHistory();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("All");
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
        case "All":
          return "All";
        default:
          return "All";
    }
  };

  let filterStartDate = dropDownName !== "All" 
  ? moment().startOf(periodDropDown()).utcOffset(0, true).toISOString()
  : null;
let filterEndDate = dropDownName !== "All"
  ? moment().endOf(periodDropDown()).utcOffset(0, true).toISOString()
  : null;

  const getQueryParams = () => {
    const baseParams = {
      ...pagination,
      search: searchBarValue,
      languageId: selectedLang.id,
    };
  
    if (dropDownName !== "All") {
      return {
        ...baseParams,
        startDate: filterStartDate,
        endDate: filterEndDate,
      };
    }
  
    return baseParams;
  };

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
      active == "/stock-management/stock"
        ? getCattlesStockList(getQueryParams())
        : active == "/stock-management/item"
        ? getCattlesItemsList(getQueryParams())
        : active == "/stock-management/supplies"
        ? getSupplyList(getQueryParams())
        : active == "/stock-management/usage" &&
          getCattlesUsageList(getQueryParams())
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
  // console.log("allPermissions", allPermissions);
  const subPermissions = permissions?.find((permissionName) => {
    if (active === "/stock-management/item") {
      return permissionName.name == "cattle-item";
    } else if (active === "/stock-management/supplies") {
      return permissionName.name == "cattle-supplies";
    } else if (active === "/stock-management/usage") {
      return permissionName.name == "cattle-usage";
    } else return false;
  });

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  // console.log("subPermission", permissions);

  const getActivePath = () => {
    switch (active) {
      case "/stock-management/stock":
        return "stock-management/stock";
      case "/stock-management/item":
        return "stock-management/item";
      case "/stock-management/supplies":
        return "stock-management/supplies";
      case "/stock-management/usage":
        return "stock-management/usage";
      default:
        return "stock-management/stock";
    }
  };

  return (
    <div className="stockmanagementwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Cattles Stock Management | Stock </title>
      </Helmet>

      <div>
        <div className="relative">
          <div className="d-sm-flex  justify-content-between align-items-center ">
            {/* <Trans i18nKey="cattle_stock" /> */}
            <CattleTabBar
              tabs={[
                {
                  name: "cattle_stock",
                  url:
                    allPermissions?.name === "all"
                      ? "/stock-management/stock"
                      : "/cattle/management",
                  active: "/stock-management/stock",
                  permissionKey: ["cattle-stock"],
                  isManagment: true,
                },
                {
                  name: "cattle_supplies",
                  url:
                    allPermissions?.name === "all"
                      ? "/stock-management/supplies"
                      : "/cattle/management",

                  active: "/stock-management/supplies",
                  permissionKey: ["cattle-supplies"],
                  isManagment: true,
                },
                {
                  name: "cattle_usage",
                  url:
                    allPermissions?.name === "all"
                      ? "/stock-management/usage"
                      : "/cattle/management",

                  active: "/stock-management/usage",
                  permissionKey: ["cattle-usage"],
                  isManagment: true,
                },
                {
                  name: "cattle_items",
                  url:
                    allPermissions?.name === "all"
                      ? "/stock-management/item"
                      : "/cattle/management",

                  active: "/stock-management/item",
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
                  // Use the helper function to get the correct path
                  history.push(
                    `/${getActivePath()}?page=1&filter=${e.target.name}`
                  );
                }}
              />
              {/* { ? ():("")} */}

              {allPermissions?.name === "all" ||
              subPermission?.includes(WRITE) ? (
                active == "/stock-management/stock" ? (
                  ""
                ) : (
                  <Button
                    color="primary"
                    onClick={() =>
                      active == "/stock-management/supplies"
                        ? history.push(
                            `/stock-management/supplies/add?page=${pagination.page}&filter=${dropDownName}`
                          )
                        : active == "/stock-management/item"
                        ? history.push(
                            `/stock-management/item/add?page=${pagination.page}&filter=${dropDownName}`
                          )
                        : active == "/stock-management/usage"
                        ? history.push(
                            `/stock-management/usage/add?page=${pagination.page}&filter=${dropDownName}`
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
                          active == "/stock-management/supplies"
                            ? "cattle_supplies_add"
                            : active == "/stock-management/item"
                            ? "cattle_items_add"
                            : active == "/stock-management/usage" &&
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

        {active == "/stock-management/stock" ? (
          <Stocks
            pagination={pagination}
            setPagination={setPagination}
            dropDownName={dropDownName}
            list={cattleStockManagementListData}
            query={cattleStockManagementList}
            searchParams={searchParams}
          />
        ) : active == "/stock-management/item" ? (
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
        ) : active == "/stock-management/supplies" ? (
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
          active == "/stock-management/usage" && (
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
    </div>
  );
};

export default StockManagement;
