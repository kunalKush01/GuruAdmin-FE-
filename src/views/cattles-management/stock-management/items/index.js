import React from "react";
import { Row } from "reactstrap";
import StockManagementItemTable from "./table";

const Items = ({ list }) => {
  console.log("list", list);
  return (
    <>
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
      <div className="">
        <Row>
          <StockManagementItemTable
            data={list}
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
    </>
  );
};

export default Items;
