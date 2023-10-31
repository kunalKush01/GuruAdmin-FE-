import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash } from "react-feather";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import {
  getAllCategories,
  getAllMasterCategories,
} from "../../api/categoryApi";
import {
  getAllCommitments,
  getAllPaidDonationsReceipts,
  nudgeUserApi,
} from "../../api/commitmentApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { ChangeStatus } from "../../components/Report & Disput/changeStatus";
import CommitmentListTable from "../../components/commitments/commitmentListTable";
import { ChangeCategoryType } from "../../components/partials/categoryDropdown";
import { ChangePeriodDropDown } from "../../components/partials/changePeriodDropDown";
import NoContent from "../../components/partials/noContent";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { WRITE } from "../../utility/permissionsVariable";

const CommitmentWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  // .ImagesVideos {
  //   font: normal normal bold 15px/33px Noto Sans;
  // }
  .addCommitment {
    color: #583703;
    /* display: flex; */
    align-items: center;
  }

  // .FormikWraper {
  //   padding: 40px;
  // }
  // .btn-Published {
  //   text-align: center;
  // }
  .addCommitment-btn {
    padding: 8px 20px;
    /* margin-left: 10px; */
    font: normal normal bold 15px/20px noto sans;
  }
  .commitmentContent {
    margin-top: 1rem;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  // .filterPeriod {
  //   color: #ff8744;
  //   margin-top: 0.5rem;
  //   font: normal normal bold 13px/5px noto sans;
  // }
`;

export default function Commitment() {
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [categoryTypeName, setCategoryTypeName] = useState("All");
  const [subCategoryTypeName, setSubCategoryTypeName] = useState("All");
  const [commitmentStatus, setCommitmentStatus] = useState("All");

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
  const { t } = useTranslation();
  const history = useHistory();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const searchParams = new URLSearchParams(history.location.search);

  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentStatus = searchParams.get("status");
  const currentFilter = searchParams.get("filter");

  const routPagination = pagination.page;
  const routFilter = dropDownName;
  const routCategory = categoryTypeName;
  const routSubCategory = subCategoryTypeName;
  const routStatus = commitmentStatus;

  useEffect(() => {
    if (
      currentPage ||
      currentCategory ||
      currentSubCategory ||
      currentStatus ||
      currentFilter
    ) {
      setCategoryTypeName(currentCategory);
      setdropDownName(currentFilter);
      setSubCategoryTypeName(currentSubCategory);
      setCommitmentStatus(currentStatus);
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

  const searchBarValue = useSelector((state) => state.search.LocalSearch);

  // master category
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
  newTypes.forEach((masterCategoryObject) => {
    if (masterCategoryObject.name == categoryTypeName) {
      newId = masterCategoryObject.id;
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

  // status
  let payloadStatus;
  if (commitmentStatus == "commitment_complete") {
    payloadStatus = "completed";
  } else if (commitmentStatus == "report_panding") {
    payloadStatus = "Pending";
  } else {
    payloadStatus = "All";
  }

  const commitmentQuery = useQuery(
    [
      "Commitments",
      pagination.page,
      selectedLang.id,
      filterEndDate,
      newId,
      dropDownName,
      subCategoryId,
      commitmentStatus,
      filterStartDate,
      searchBarValue,
    ],
    () =>
      getAllCommitments({
        ...pagination,
        startDate: filterStartDate,
        endDate: filterEndDate,
        masterId: newId,
        categoryId: subCategoryId,
        status: payloadStatus,
        languageId: selectedLang.id,
        search: searchBarValue,
      }),
    {
      keepPreviousData: true,
    }
  );

  const commitmentItems = useMemo(
    () => commitmentQuery?.data?.results ?? [],
    [commitmentQuery]
  );
  // PERMISSSIONS
  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "commitment"
  );

  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );
  const [selectedRows, setSelectedRows] = useState([]);

  const notifyIds = selectedRows?.map((item) => item?.notifyUserId);

  const [popover, setPopover] = useState(false);

  const onHover = () => {
    setPopover(true);
  };
  const onHoverLeave = () => {
    setPopover(false);
  };

  const queryClient = useQueryClient();
  return (
    <CommitmentWrapper>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Mandir Admin | Commitment</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <img
              src={arrowLeft}
              className="me-2  cursor-pointer align-self-center"
              onClick={() => history.push("/")}
            />
            <div className="addCommitment d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"commitment"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addCommitment d-flex flex-wrap gap-2 gap-md-0">
            <ChangeCategoryType
              className={"me-1"}
              categoryTypeArray={newTypes}
              typeName={ConverFirstLatterToCapital(categoryTypeName ?? "")}
              setTypeName={(e) => {
                setCategoryId(e.target.id);
                setCategoryTypeName(e.target.name);
                setPagination({ page: 1, limit: 10 });
                history.push(
                  `/commitment?page=${1}&category=${
                    e.target.name
                  }&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
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
                setPagination({ page: 1, limit: 10 });
                history.push(
                  `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${
                    e.target.name
                  }&status=${commitmentStatus}&filter=${dropDownName}`
                );
              }}
            />
            <ChangeStatus
              className={"me-1"}
              dropDownName={commitmentStatus}
              setdropDownName={(e) => {
                setCommitmentStatus(e.target.name);
                setPagination({ page: 1, limit: 10 });
                history.push(
                  `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${
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
                setPagination({ page: 1, limit: 10 });
                history.push(
                  `/commitment?page=${1}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${
                    e.target.name
                  }`
                );
              }}
            />
            {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? (
              <Button
                color="primary"
                className={`addCommitment-btn mt-md-1 mt-lg-0`}
                onClick={() =>
                  history.push(
                    `/commitment/add?page=${pagination.page}&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
                  )
                }
              >
                <span>
                  <Plus className="" size={15} strokeWidth={4} />
                </span>
                <span>
                  <Trans i18nKey={"add_commitment"} />
                </span>
              </Button>
            ) : (
              ""
            )}
            <Button
              id="Popover1"
              color="success"
              onMouseEnter={onHover}
              onMouseLeave={onHoverLeave}
              className={`addCommitment ms-1 ${
                notifyIds?.length > 0 ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => {
                notifyIds?.length > 0 &&
                  nudgeUserApi({ commitmentIds: notifyIds }).then((res) => {
                    if (!res.error) {
                      queryClient.invalidateQueries(["Commitments"]);
                      setSelectedRows([]);
                    }
                  });
              }}
            >
              <Trans i18nKey={"notify_user"} />
            </Button>
            {notifyIds?.length <= 0 && (
              <div className="">
                <Popover
                  placement="bottom"
                  isOpen={popover}
                  target="Popover1"
                  trigger="hover"
                  className="notifyUserPOP"
                >
                  <PopoverHeader>
                    {" "}
                    <Trans i18nKey={"notify_user"} />
                  </PopoverHeader>
                  <PopoverBody>
                    <Trans i18nKey={"notify_user_content"} />
                  </PopoverBody>
                </Popover>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          <If condition={commitmentQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If>
        </div>
        <div className="commitmentContent  ">
          <Row>
            <If condition={commitmentQuery.isLoading} disableMemo>
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
                <If
                  condition={
                    !commitmentQuery.isFetching && commitmentItems.length != 0
                  }
                  disableMemo
                >
                  <Then>
                    <CommitmentListTable
                      data={commitmentItems}
                      currentFilter={routFilter}
                      currentPage={routPagination}
                      selectedRows={selectedRows}
                      notifyIds={notifyIds}
                      setSelectedRows={setSelectedRows}
                      currentCategory={routCategory}
                      currentStatus={routStatus}
                      currentSubCategory={routSubCategory}
                      allPermissions={allPermissions}
                      subPermission={subPermission}
                    />
                  </Then>
                  <Else>
                    {!commitmentQuery.isFetching &&
                      !commitmentQuery.isLoading &&
                      commitmentItems.length == 0 && (
                        <NoContent
                          headingNotfound={t("commitment_not_found")}
                          para={t("commitment_not_click_add_commitment")}
                        />
                      )}
                  </Else>
                </If>
              </Else>
            </If>

            <If
              condition={
                commitmentQuery?.data?.totalPages > 1 &&
                !commitmentQuery.isFetching &&
                !commitmentQuery.isLoading
              }
            >
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={commitmentQuery?.data?.totalPages || 0}
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
                      history.push(
                        `/commitment?page=${
                          page.selected + 1
                        }&category=${categoryTypeName}&subCategory=${subCategoryTypeName}&status=${commitmentStatus}&filter=${dropDownName}`
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
    </CommitmentWrapper>
  );
}
