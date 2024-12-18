import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import MemberShipListTable from "../../components/membership/MemberShipListTable";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import { useHistory } from "react-router-dom";
import { getAllMembers, getMemberSchema } from "../../api/membershipApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { WRITE } from "../../utility/permissionsVariable";
import filterIcon from "../../assets/images/icons/filter.svg";
import FilterTag from "../../components/partials/filterTag";
import AddFilterSection from "../../components/partials/addFilterSection";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import ImportForm from "../donation/importForm";
import { Dropdown, Space } from "antd";
import ImportHistoryTable from "../../components/donation/importHistoryTable";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import syncIcon from "../../assets/images/icons/sync.svg";

function MemberShipListView() {
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const history = useHistory();
  const queryClient = useQueryClient();
  const [filterData, setFilterData] = useState({});
  const { t } = useTranslation();

  const permissions = useSelector(
    (state) => state.auth.userDetail?.permissions
  );
  const allPermissions = permissions?.find(
    (permissionName) => permissionName.name === "all"
  );
  const subPermissions = permissions?.find(
    (permissionName) => permissionName.name === "membership"
  );
  const subPermission = subPermissions?.subpermissions?.map(
    (item) => item.name
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const filteredData = useMemo(() => {
    return Object.entries(filterData).reduce((acc, [key, value]) => {
      const { index, ...rest } = value; // Destructure and exclude 'index'
      acc[key] = rest; // Add the remaining data
      return acc;
    }, {});
  }, [filterData]);
  const { data } = useQuery(
    ["memberShipListData", pagination.page, pagination.limit, filteredData],
    () =>
      getAllMembers({
        ...pagination,
        ...(filterData && filteredData && { advancedSearch: filteredData }),
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching member data:", error);
      },
    }
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [isfetchField, setIsfetchField] = useState(false);

  const showFilter = () => {
    setFilterOpen(true);
    setIsfetchField(true);
  };
  const onFilterClose = () => {
    setFilterOpen(false);
    setIsfetchField(false);
  };
  const handleApplyFilter = (e) => {
    showFilter();
  };
  const onFilterSubmit = (filterData) => {
    setFilterData(filterData);
  };
  const [removedData, setRemovedData] = useState({});
  const handleRemoveAllFilter = () => {
    const removedFilters = { ...filterData };
    setFilterData({});
    setRemovedData(removedFilters);
  };
  const [rowId, setRowId] = useState(null);
  const removeFilter = (fieldName, id) => {
    const newFilterData = { ...filterData };
    delete newFilterData[fieldName];

    setFilterData(newFilterData);
    setRowId(id);
  };
  const hasFilters = Object.keys(filterData).length > 0;

  //**import */
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleImport = (e) => {
    showDrawer();
  };
  const memberShipQuery = useQuery(
    ["memberShipSchema"],
    () => getMemberSchema(),
    {
      keepPreviousData: true,
    }
  );

  const memberSchemaItem = useMemo(
    () => memberShipQuery?.data?.schema ?? [],
    [memberShipQuery]
  );
  const memberSchema = memberSchemaItem ? memberSchemaItem.memberSchema : {};
  const [mappedField, setMappedField] = useState(null);
  useEffect(() => {
    if (memberSchema) {
      function transformSchema(schema) {
        let output = [];

        function traverseSchema(properties, parentKey = "") {
          if (parentKey == "upload") {
            return false;
          }
          for (let key in properties) {
            const property = properties[key];
            if (property.type === "array") {
              continue;
            }
            const currentKey = key;
            if (property.type === "object") {
              traverseSchema(property.properties, currentKey);
            } else if (property.title) {
              output.push({
                value: currentKey,
                label: property.title,
              });
            }
          }
        }

        traverseSchema(schema.properties);
        return output;
      }

      const result = transformSchema(memberSchema);
      setMappedField(result);
    }
  }, [memberSchema]);
  const [showHistory, setShowHistory] = useState(false);
  const handleMenuClick = (e) => {
    setShowHistory(true);
  };
  const handleRefresh = () => {
    !showHistory
      ? queryClient.invalidateQueries(["suspenseData"])
      : queryClient.invalidateQueries(["suspenseDataHistory"]);
  };
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Membership</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addAction d-flex">
              <div className="">
                <div>
                  {showHistory ? (
                    <img
                      src={arrowLeft}
                      className="me-2  cursor-pointer"
                      onClick={() => setShowHistory(false)}
                    />
                  ) : (
                    <Trans i18nKey={"membership"} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Space wrap className="d-flex">
            <Space className="me-2">
              {showHistory ? (
                <img
                  src={syncIcon}
                  alt="Loading"
                  style={{ width: 24, height: 24, cursor: "pointer" }}
                  onClick={handleRefresh}
                />
              ) : (
                <div></div>
              )}
            </Space>
            <div className="addAction d-flex flex-wrap gap-2 gap-md-0">
              {(allPermissions?.name === "all" ||
                subPermission?.includes(WRITE)) && (
                <Button
                  className={`addAction-btn`}
                  color="primary"
                  onClick={() => history.push(`/member/addMember`)}
                >
                  Add
                </Button>
              )}

              <input type="file" accept="" className="d-none" />
            </div>
            {/* <Button
              className="addAction-btn me-1"
              color="primary"
              onClick={handleImport}
            >
              {t("import")}
            </Button> */}
            <Dropdown.Button
              type="primary"
              size="large"
              className="dropDownBtn"
              menu={{
                items: [
                  {
                    label: t("history"),
                    key: "history",
                  },
                ],
                onClick: handleMenuClick,
              }}
              onClick={handleImport}
            >
              {t("import")}
            </Dropdown.Button>
            <Button
              className="secondaryAction-btn"
              color="primary"
              onClick={handleApplyFilter}
            >
              <img
                src={filterIcon}
                alt="Filter Icon"
                width={20}
                className="filterIcon"
              />
              {t("filter")}
            </Button>
          </Space>
        </div>
        <div className="d-flex justify-content-between">
          <FilterTag
            hasFilters={hasFilters}
            filterData={filterData}
            removeFilter={removeFilter}
            handleRemoveAllFilter={handleRemoveAllFilter}
          />
        </div>
        <div style={{ height: "10px" }}></div>
        <div className="commitmentContent">
          <Row>
            {!showHistory ? (
              <MemberShipListTable
                data={data ? data.results : []}
                totalItems={data ? data.totalResults : 0}
                pageSize={pagination.limit}
                onChangePage={(page) => {
                  setPagination((prev) => ({ ...prev, page }));
                }}
                onChangePageSize={(pageSize) => {
                  setPagination((prev) => ({
                    ...prev,
                    limit: pageSize,
                    page: 1,
                  }));
                }}
              />
            ) : (
              <ImportHistoryTable tab={"Membership"} />
            )}
          </Row>
        </div>
      </div>
      <AddFilterSection
        onFilterClose={onFilterClose}
        filterOpen={filterOpen}
        onSubmitFilter={onFilterSubmit}
        moduleName={"Member"}
        activeFilterData={filterData ?? {}}
        rowId={rowId ?? null}
        removedData={removedData}
        languageId={selectedLang.id}
        fetchField={isfetchField}
      />
      <ImportForm
        onClose={onClose}
        open={open}
        tab="MemberShip"
        mappedField={mappedField}
      />
    </div>
  );
}

export default MemberShipListView;
