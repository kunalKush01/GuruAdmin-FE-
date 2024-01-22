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
} from "../../../api/cattle/cattleStock";
import CattleTabBar from "../../../components/cattleTabBar";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import Items from "./items";
import Stocks from "./stock";

const StockManagementWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .btn {
    font-weight: bold;
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
    limit: 12,
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
      active == "/cattle/stock"
        ? getCattlesStockList({
            ...pagination,
            search: searchBarValue,
            startDate: filterStartDate,
            endDate: filterEndDate,
            languageId: selectedLang.id,
          })
        : getCattlesItemsList({
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
        <div className="d-sm-flex mb-1 mb-lg-0 justify-content-between align-items-center ">
          {/* <Trans i18nKey="cattle_stock" /> */}
          <CattleTabBar
            tabs={[
              { name: "Stock", url: "/cattle/stock" },
              { name: "Items", url: "/cattle/items" },
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
                // history.push(`/news?page=${1}&filter=${e.target.name}`);
              }}
            />
            {/* {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? ( */}
            <Button
              color="primary"
              onClick={() =>
                active == "/cattle/stock"
                  ? Swal.fire({
                      icon: "info",
                      title: "Oops...",
                      text: "Add Stock is in underdevelopment ",
                      showConfirmButton: false,
                      showCloseButton: false,
                      timer: 2000,
                    })
                  : history.push(
                      `/cattle/items/add?page=${pagination.page}&filter=${dropDownName}`
                    )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans
                  i18nKey={
                    active == "/cattle/stock"
                      ? "cattle_stock_add"
                      : "cattle_items_add"
                  }
                />
              </span>
            </Button>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
        {active == "/cattle/stock" ? (
          <Stocks list={cattleStockManagementListData} />
        ) : (
          <Items list={cattleStockManagementListData} />
        )}
      </div>
    </StockManagementWrapper>
  );
};

export default StockManagement;
