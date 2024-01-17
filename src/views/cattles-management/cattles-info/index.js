import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans } from "react-i18next";
import { Button, Row } from "reactstrap";
import styled from "styled-components";
import CattleTabBar from "../../../components/cattleTabBar";
import { ChangePeriodDropDown } from "../../../components/partials/changePeriodDropDown";
import { cattleHeader } from "../../../utility/subHeaderContent/cattleHeader";
import CattleInfoTable from "./table";

const CattleInfo = styled.div`
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

const CattlesInfo = () => {
  const [active, setActive] = useState(location.pathname);
  const [dropDownName, setdropDownName] = useState("dashboard_monthly");
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

  return (
    <CattleInfo>
      <CattleTabBar tabs={cattleHeader} active={active} setActive={setActive} />
      <div>
        <div className="d-sm-flex mb-1 justify-content-between align-items-center ">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addNews">
              <div className="">
                <div>
                  <Trans i18nKey="cattle_registered" />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex mt-1 mt-sm-0 justify-content-between">
            <ChangePeriodDropDown
              className={"me-1"}
              dropDownName={dropDownName}
              setdropDownName={(e) => {
                setdropDownName(e.target.name);
                setPagination({ page: 1 });
                history.push(`/news?page=${1}&filter=${e.target.name}`);
              }}
            />
            {/* {allPermissions?.name === "all" ||
            subPermission?.includes(WRITE) ? ( */}
            <Button
              color="primary"
              className="addNews-btn"
              onClick={
                () => alert("Sorry it's in under development")
                // history.push(
                //   `/news/add?page=${pagination.page}&filter=${dropDownName}`
                // )
              }
            >
              <span>
                <Plus className="" size={15} strokeWidth={4} />
              </span>
              <span>
                <Trans i18nKey={"cattle_add"} />
              </span>
            </Button>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
        <div style={{ height: "10px" }}>
          {/* <If condition={newsQuery.isFetching}>
            <Then>
              <Skeleton
                baseColor="#ff8744"
                highlightColor="#fff"
                height={"3px"}
              />
            </Then>
          </If> */}
        </div>
        <div className="newsContent  ">
          <Row>
            <CattleInfoTable
              data={[]}
              // allPermissions={allPermissions}
              // subPermission={subPermission}
            />
            {/* <If condition={newsQuery.isLoading} disableMemo>
              <Then>
                <SkeletonTheme
                  baseColor="#FFF7E8"
                  highlightColor="#fff"
                  borderRadius={"10px"}
                >
                  {randomArray.map((itm, idx) => {
                    return (
                      <Col xs={3} key={idx}>
                        <Skeleton height={"335px"} width={"300px"} />
                      </Col>
                    );
                  })}
                </SkeletonTheme>
              </Then>
              <Else>
                <If condition={newsItems.length != 0} disableMemo>
                  <Then>
                    <CattleInfoTable
                      data={[]}
                      allPermissions={allPermissions}
                      subPermission={subPermission}
                    />
                  </Then>
                  <Else>
                    <NoContent
                      headingNotfound={t("news_not_found")}
                      para={t("news_not_click_add_news")}
                    />
                  </Else>
                </If>
              </Else>
            </If> */}

            {/* <If condition={newsQuery?.data?.totalPages > 1}>
              <Then>
                <Col xs={12} className="mb-2 d-flex justify-content-center">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={pagination.page - 1}
                    breakLabel="..."
                    previousLabel=""
                    pageCount={newsQuery?.data?.totalPages || 0}
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
                        `/events?page=${
                          page.selected + 1
                        }&filter=${dropDownName}`
                      );
                    }}
                    // forcePage={pagination.page !== 0 ? pagination.page - 1 : 0}
                    containerClassName={
                      "pagination react-paginate justify-content-end p-1"
                    }
                  />
                </Col>
              </Then>
            </If> */}
          </Row>
        </div>
      </div>
    </CattleInfo>
  );
};

export default CattlesInfo;
