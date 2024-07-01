import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { getDharmshalaList } from "../../../api/dharmshala/dharmshalaInfo";
import NoContent from "../../../components/partials/noContent";
import DharmshalaInfoTable from "./table";
import { Helmet } from "react-helmet";
import { DharmshalaInfo } from "../dharmshalaStyles";

const DharmshalasInfo = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const importFileRef = useRef();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  useEffect(() => {
    if (currentPage || currentFilter || currentStatus) {
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const dharmshalaList = useQuery(
    [
      "dharmshalaList",
      pagination?.page,
      selectedLang.id,
      searchBarValue,
    ],
    () =>
      getDharmshalaList({
        ...pagination,
        search: searchBarValue,
        languageId: selectedLang.id,
      })
  );

  const dharmshalaListData = useMemo(
    () => dharmshalaList?.data?.results ?? [],
    [dharmshalaList]
  );

  const queryClient = useQueryClient();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importFile(formData);
      queryClient.invalidateQueries(["dharmshalaList"]);
    }
  };

  const isMobileView = window.innerWidth <= 784;

  return (
    <DharmshalaInfo>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Dharmshala</title>
      </Helmet>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="building_registered" />
          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <Button
              className="me-1"
              color="primary"
              onClick={() =>
                history.push(
                  `/building/info/add?page=${pagination.page}&filter=${dropDownName}`
                )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
              <Trans i18nKey={"building_add"} />
              </span>
            </Button>
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={dharmshalaList.isFetching || dharmshalaList.isLoading}>
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
            <div className="table-container-style">
              <If
                condition={
                  !dharmshalaList.isLoading &&
                  dharmshalaListData.length !== 0 &&
                  !dharmshalaList.isFetching
                }
                disableMemo
              >
                <Then>
                  <DharmshalaInfoTable
                    data={dharmshalaListData}
                    height="160px"
                    currentFilter={dropDownName}
                    currentPage={pagination.page}
                    isMobileView={isMobileView}
                  />
                </Then>
                <Else>
                  <If
                    condition={
                      !dharmshalaList.isLoading &&
                      dharmshalaListData.length === 0
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
                  !dharmshalaList.isFetching &&
                  dharmshalaList?.data?.totalPages > 1
                }
              >
                <Then>
                  <Col xs={12} className=" d-flex justify-content-center">
                    <ReactPaginate
                      nextLabel=""
                      forcePage={pagination.page - 1}
                      breakLabel="..."
                      previousLabel=""
                      pageCount={dharmshalaList?.data?.totalPages || 0}
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
                        setPagination({
                          ...pagination,
                          page: page.selected + 1,
                        });
                        history.push(
                          `/dharmshala/info?page=${
                            page.selected + 1
                          }&status=${currentStatus}&filter=${dropDownName}`
                        );
                      }}
                      containerClassName={
                        "pagination react-paginate justify-content-end p-1"
                      }
                    />
                  </Col>
                </Then>
              </If>
            </div>
          </Row>
        </div>
      </div>
    </DharmshalaInfo>
  );
};

export default DharmshalasInfo;
