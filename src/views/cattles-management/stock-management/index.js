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
        : active == "/cattle/management/items"
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

  return (
    <StockManagementWrapper>
      <div>
        <div className="relative">
          <div className="d-sm-flex  justify-content-between align-items-center ">
            {/* <Trans i18nKey="cattle_stock" /> */}
            <CattleTabBar
              tabs={[
                {
                  name: "Stock",
                  url: "/cattle/management/stock",
                  active: "/cattle/management/stock",
                },
                {
                  name: "Supplies",
                  url: "/cattle/management/supplies",
                  active: "/cattle/management/supplies",
                },
                {
                  name: "Usage",
                  url: "/cattle/management/usage",
                  active: "/cattle/management/usage",
                },
                {
                  name: "Items",
                  url: "/cattle/management/items",
                  active: "/cattle/management/items",
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
                        : active == "/cattle/management/items"
                        ? "cattle/management/items"
                        : active == "/cattle/management/supplies"
                        ? "cattle/management/supplies"
                        : active == "/cattle/management/usage"
                        ? "cattle/management/usage"
                        : "/not-fount"
                    }?page=${1}&filter=${e.target.name}`
                  );
                }}
              />
              {/* {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? ( */}
              {active == "/cattle/management/stock" ? (
                ""
              ) : (
                <Button
                  color="primary"
                  onClick={() =>
                    active == "/cattle/management/supplies"
                      ? history.push(
                          `/cattle/management/supplies/add?page=${pagination.page}&filter=${dropDownName}`
                        )
                      : active == "/cattle/management/items"
                      ? history.push(
                          `/cattle/management/items/add?page=${pagination.page}&filter=${dropDownName}`
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
                          : active == "/cattle/management/items"
                          ? "cattle_items_add"
                          : active == "/cattle/management/usage" &&
                            "cattle_usage_add"
                      }
                    />
                  </span>
                </Button>
              )}
              {/* ) : (
              ""
            )} */}
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
        ) : active == "/cattle/management/items" ? (
          <Items
            pagination={pagination}
            setPagination={setPagination}
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
