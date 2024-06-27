<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
import { useQuery } from "@tanstack/react-query";
=======
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Else, If, Then } from "react-if-else-switch";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
import styled from "styled-components";
import { getCattlesCategoryList } from "../../../api/cattle/cattleCategory";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import CattleCategoryModal from "./categoryModal";
import CattleBreedTable from "./table";

const CattleCategoryWrapper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;

  .btn {
    font-weight: bold;
  }
`;
=======
import arrowLeft from "../../../assets/images/icons/arrow-left.svg";
import { getAllRooms, getAllRoomsByFloorId } from "../../../api/dharmshala/dharmshalaInfo";
import exportIcon from "../../../assets/images/icons/exportIcon.svg";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import NoContent from "../../../components/partials/noContent";
import { handleExport } from "../../../utility/utils/exportTabele";
import DharmshalaRoomTable from "./table";
import { ChangeCategoryType } from "../../../components/partials/categoryDropdown";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DharmshalaRoomInfo } from "../dharmshalaStyles";
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js

const CattleCategory = () => {
  const history = useHistory();
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
=======
  const { floorId } = useParams();
  const { buildingId } = useParams();
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
  const { t } = useTranslation();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const searchBarValue = useSelector((state) => state.search.LocalSearch);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js

  const [modal, setModal] = useState({
    modal: false,
    addCattleCategory: false,
    categoryId: "",
    name: "",
  });

  const toggle = (row) => {
    setModal({
      modal: !modal.modal,
      addCattleCategory: row?.addCattleCategory,
      categoryId: row?._id ?? "",
      name: row?.name ?? "",
    });
  };

=======
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
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

  const cattleCategoryList = useQuery(
    [
      "cattleCategoryList",
      filterStartDate,
      filterEndDate,
      pagination?.page,
      selectedLang.id,
      searchBarValue,
      floorId
    ],
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
    () =>
      getCattlesCategoryList({
        ...pagination,
        search: searchBarValue,
        startDate: filterStartDate,
        endDate: filterEndDate,
        languageId: selectedLang.id,
      })
  );

  const cattleCategoryData = useMemo(
    () => cattleCategoryList?.data?.results ?? [],
    [cattleCategoryList]
  );
=======
    () => getAllRoomsByFloorId(floorId),
  );

  const dharmshalaRoomListData = useMemo(
    () => dharmshalaRoomList?.data?.results ?? [],
    [dharmshalaRoomList]
  );

  const URLParams = useParams("");

  const queryClient = useQueryClient();
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js

  const isMobileView = window.innerWidth <= 784;

  return (
    <CattleCategoryWrapper>
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <Trans i18nKey="cattles" /> <Trans i18nKey="category" />
          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
                  `/configuration/cattle-category?page=${1}&filter=${
                    e.target.name
                  }`
                );
              }}
=======
                  `/floors/${URLParams.buildingId}?page=${currentPage}&status=${currentStatus}&filter=${currentFilter}`
                )
              }
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
            />

            {/* {allPermissions?.name === "all" ||
                subPermission?.includes(WRITE) ? ( */}
            <Button
              className="me-1"
              color="primary"
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
              onClick={() => toggle({ addCattleCategory: true })}
=======
              onClick={() =>
                history.push(
                  `/rooms/add/${floorId}/${URLParams.buildingId}?page=${pagination.page}&filter=${dropDownName}`
                )
              }
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"cattle_category_add"} />
              </span>
            </Button>
          </div>
        </div>

        <div style={{ height: "10px" }}>
          <If
            condition={
              cattleCategoryList.isFetching || cattleCategoryList.isLoading
            }
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
                !cattleCategoryList.isLoading &&
                cattleCategoryData.length != 0 &&
                !cattleCategoryList.isFetching
              }
              disableMemo
            >
              <Then>
                <CattleBreedTable
                  data={cattleCategoryData}
                  height="160px"
<<<<<<< Updated upstream:src/views/dharmshala-management/cattle-category/index.js
                  toggle={toggle}
                  // allPermissions={allPermissions}
                  // subPermission={subPermission}
=======
                  currentFilter={routFilter}
                  currentPage={routPagination}
                  isMobileView={isMobileView}
>>>>>>> Stashed changes:src/views/dharmshala-management/dharmshala-room/index.js
                />
              </Then>
              <Else>
                <If
                  condition={
                    !cattleCategoryList.isLoading &&
                    cattleCategoryData.length == 0
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
                !cattleCategoryList.isFetching &&
                cattleCategoryList?.data?.totalPages > 1
              }
            >
              <Then>
                <Col xs={12} className=" d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={cattleCategoryList?.data?.totalPages || 0}
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
                        `/configuration/cattle-category?page=${
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

      <CattleCategoryModal
        isOpen={modal?.modal}
        toggle={toggle}
        data={modal}
        addCattleCategory={modal?.addCattleCategory}
      />
    </CattleCategoryWrapper>
  );
};

export default CattleCategory;
