import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCattlesBreedList } from "../../../api/cattle/cattleBreed";
import styled from "styled-components";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import { Button, Col, Row } from "reactstrap";
import CattleBreedTable from "./table";
import { Plus } from "react-feather";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import NoContent from "../../../components/partials/noContent";
import ReactPaginate from "react-paginate";
import BreedModal from "./breedModal";
import "../../../assets/scss/viewCommon.scss";
const CattleBreed = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [modal, setModal] = useState({
    modal: false,
    addBreed: false,
    breedId: "",
    name: "",
    cattleCategoryId: null,
  });

  const toggle = (row) => {
    setModal({
      modal: !modal.modal,
      addBreed: row?.addBreed,
      breedId: row?._id ?? "",
      name: row?.name ?? "",
      cattleCategoryId: row?.category,
    });
  };

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

  const cattleBreedList = useQuery(
    [
      "cattleBreedList",
      filterStartDate,
      filterEndDate,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getCattlesBreedList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      })
  );

  const breedData = useMemo(
    () => cattleBreedList?.data?.results ?? [],
    [cattleBreedList]
  );

  return (
    <div className="breedwrapper">
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="cattles" /> <Trans i18nKey="cattle_breed" />
          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/configuration/cattle-breed?page=${1}&filter=${
                    e.target.name
                  }`
                );
              }}
            />

            {/* {allPermissions?.name === "all" ||
                subPermission?.includes(WRITE) ? ( */}
            <Button
              className="me-1"
              color="primary"
              onClick={() => toggle({ addBreed: true })}
              style={{height:"38px"}}
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"cattle_breed_add"} />
              </span>
            </Button>
          </div>
        </div>

        <div style={{ height: "10px" }}>
          <If
            condition={cattleBreedList.isFetching || cattleBreedList.isLoading}
          >
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="newsContent">
          <Row>
            <If
              condition={
                !cattleBreedList.isLoading &&
                breedData.length != 0 &&
                !cattleBreedList.isFetching
              }
              disableMemo
            >
              <Then>
                <CattleBreedTable
                  data={breedData}
                  height="160px"
                  toggle={toggle}
                  // allPermissions={allPermissions}
                  // subPermission={subPermission}
                />
              </Then>
              <Else>
                <If
                  condition={
                    !cattleBreedList.isLoading && breedData.length == 0
                  }
                  disableMemo
                >
                  <Then>
                    <NoContent
                      headingNotfound={t("no_data_found")}
                      para={t("no_data_found_add_data")}
                    />
                  </Then>
                </If>
              </Else>
            </If>
            <If
              condition={
                !cattleBreedList.isFetching &&
                cattleBreedList?.data?.totalPages > 1
              }
            >
              <Then>
                <Col xs={12} className=" d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={cattleBreedList?.data?.totalPages || 0}
                    activeClassName="active"
                    initialPage={
                      parseInt(searchParams.get("page"))
                        ? parseInt(searchParams.get("page")) - 1
                        : pagination.page - 1
                    }
                    breakClassName="page-item"
                    pageClassName={"page-item"}
                    breakLinkClassName="page-link"
                    nextLinkClassName={"page-link"}
                    pageLinkClassName={"page-link"}
                    nextClassName={"page-item next"}
                    previousLinkClassName={"page-link"}
                    previousClassName={"page-item prev"}
                    onPageChange={(page) => {
                      setPagination({ ...pagination, page: page.selected + 1 });
                      navigate(
                        `/configuration/cattle-breed?page=${
                          page.selected + 1
                        }&filter=${dropDownName}`
                      );
                    }}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                  />
                </Col>
              </Then>
            </If>
          </Row>
        </div>
      </div>

      <BreedModal
        isOpen={modal?.modal}
        toggle={toggle}
        data={modal}
        addBreed={modal?.addBreed}
      />
    </div>
  );
};

export default CattleBreed;
