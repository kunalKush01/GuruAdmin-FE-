import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../api/categoryApi";
import { getAllDonation, importDonationFile } from "../../api/dharmshalaApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import DonationList from "../../components/donation/donationList";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { WRITE } from "../../utility/permissionsVariable";

const DharmshalaWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  // .ImagesVideos {
  //   font: normal normal bold 15px/33px Noto Sans;
  // }
  .addDonation {
    color: #583703;
    /* display: flex; */
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addDonation-btn {
    padding: 8px 20px;
    /* margin-left: 10px; */
    font: normal normal bold 15px/20px noto sans;
  }
  .donationContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;
    margin-top: 0.5rem;
    font: normal normal bold 13px/5px noto sans;
  }
`;

export default function Dharmshala() {
  const { t } = useTranslation();
  const importFileRef = useRef();
  const [categoryTypeName, setCategoryTypeName] = useState(t("All"));
  const [subCategoryTypeName, setSubCategoryTypeName] = useState(t("All"));
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");

  const selectedLang = useSelector((state) => state.auth.selectLang);
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
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentFilter = searchParams.get("filter");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");

  useEffect(() => {
    if (currentPage || currentCategory || currentFilter || currentSubCategory) {
      setCategoryTypeName(currentCategory);
      setSubCategoryTypeName(currentSubCategory);
      setdropDownName(currentFilter);
      setPagination({ ...pagination, page: parseInt(currentPage) });
    }
  }, []);

  let filterStartDate = moment()
    .startOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();
  let filterEndDate = moment()
    .endOf(periodDropDown())
    .utcOffset(0, true)
    .toISOString();

  const categoryTypeQuery = useQuery(
    ["categoryTypes"],
    () =>
      getAllMasterCategories({
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );
  const categoryTypeItem = useMemo(
    () => categoryTypeQuery?.data?.results ?? [],
    [categoryTypeQuery]
  );
  const newTypes = [{ id: "", name: "All" }, ...categoryTypeItem];

  let newId;
  newTypes.forEach((newObject) => {
    if (newObject.name == categoryTypeName) {
      newId = newObject.id;
    }
  });
  const [categoryId, setCategoryId] = useState();

  // sub category
  const subCategoryTypeQuery = useQuery(
    ["subCategoryTypes", newId],
    () =>
      getAllCategories({
        masterId: newId,
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );
  const subCategoryTypeItem = useMemo(
    () => subCategoryTypeQuery?.data?.results ?? [],
    [subCategoryTypeQuery]
  );
  const subCategoryTypes = [{ id: "", name: "All" }, ...subCategoryTypeItem];

  let subCategoryId;
  subCategoryTypes.forEach((subCategoryObject) => {
    if (subCategoryObject.name == subCategoryTypeName) {
      subCategoryId = subCategoryObject.id;
    }
  });
  const [subCategoryTypeId, setSubCategoryTypeId] = useState();

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  const dharmshalaQuery = useQuery(
    [
      "dharmshalas",
      pagination.page,
      selectedLang.id,
      newId,
      subCategoryId,
      filterEndDate,
      filterStartDate,
      searchBarValue,
    ],
    () =>
      getAllDharmshalas({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        masterId: newId,
        categoryId: subCategoryId,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      }),
    {
      keepPreviousData: true,
    }
  );

  const dharmshalaItems = useMemo(
    () => dharmshalaQuery?.data?.results ?? [],
    [dharmshalaQuery]
  );

  const queryClient = useQueryClient();

  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "donation"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  return (
    <DharmshalaWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Dharmshala</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            {/* <img
              src={arrowLeft}
              className="me-2 cursor-pointer align-self-center"
              onClick={() => navigate("/")}
            /> */}
            <div className="addDonation d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"donation_Donation"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addDonation d-flex flex-wrap gap-2 gap-md-0">
            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={newTypes}
              typeName={ConverFirstLatterToCapital(categoryTypeName ?? "")}
              setTypeName={(e) => {
                setCategoryId(e.target.id);
                setCategoryTypeName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/donation?page=${1}&category=${
                    e.target.name
                  }&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                );
              }}
            />

            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={subCategoryTypes}
              typeName={ConverFirstLatterToCapital(subCategoryTypeName ?? "")}
              setTypeName={(e) => {
                setSubCategoryTypeId(e.target.id);
                setSubCategoryTypeName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/donation?page=${1}&category=${categoryTypeName}&subCategory=${
                    e.target.name
                  }&filter=${dropDownName}`
                );
              }}
            />
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                navigate(
                  `/donation?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${
                    e.target.name
                  }`
                );
              }}
            />

            <Button
              className="me-1"
              color="primary"
              onClick={() => importFileRef.current.click()}
            >
              {t("Import_File")}
            </Button>

            <input
              type="file"
              ref={importFileRef}
              accept=""
              className="d-none"
              onChange={handleImportFile}
            />

            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className={`addDonation-btn`}
                onClick={() =>
                  navigate(
                    `/donation/add?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"donation_Adddonation"} />
                </span>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={donationQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="donationContent  ">
          <Row>
            <If condition={donationQuery.isLoading} disableMemo>
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
                <If condition={donationItems.length != 0} disableMemo>
                  <Then>
                    <DonationList
                      data={donationItems}
                      allPermissions={allPermissions}
                      subPermission={subPermission}
                    />
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("donation_not_found")}
                      para={t("donation_not_click_add_donation")}
                    />
                  </Else>
                </If>
              </Else>
            </If>

            <If condition={donationQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={donationQuery?.data?.totalPages || 0}
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
                        `/donation?page=${
                          page.selected + 1
                        }&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&filter=${dropDownName}`
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
    </DharmshalaWrapper>
  );
}
