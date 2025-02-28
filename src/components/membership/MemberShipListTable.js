import { Table, Dropdown, Menu } from "antd";
import React, { useState, useEffect } from "react";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MemberShipListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
  onSelectionChange = () => {},
  setAllSelectedKeys,
  allSelectedKeys,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectionsByPage, setSelectionsByPage] = useState({});
  // const [allSelectedKeys, setAllSelectedKeys] = useState([]);

  const handleSelectChange = (newSelectedRowKeys) => {
    const currentPageIds = data.map(item => item._id);
    
    const selectionsFromOtherPages = allSelectedKeys.filter(
      id => !currentPageIds.includes(id)
    );
    const updatedSelections = [...selectionsFromOtherPages, ...newSelectedRowKeys];
    
    setAllSelectedKeys(updatedSelections);
    onSelectionChange(updatedSelections);
  };

  useEffect(() => {
    const currentPageSelections = selectionsByPage[currentPage] || [];
    setSelectedRowKeys(currentPageSelections);
  }, [currentPage, selectionsByPage]);

  const getAllSelectedIds = () => {
    return Object.values(selectionsByPage).flat();
  };

  const selectionMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Select current page",
          onClick: () => {
            const currentPageIds = data.map((item) => item._id);
            handleSelectChange(currentPageIds);
          },
        },
        {
          key: "2",
          label: "Invert current page",
          onClick: () => {
            const currentPageIds = data.map((item) => item._id);
            const currentPageSelected = currentPageIds.filter(id => 
              allSelectedKeys.includes(id)
            );
            
            // If all current page items are selected, unselect them
            if (currentPageSelected.length === currentPageIds.length) {
              handleSelectChange([]);
            } 
            // Otherwise, select unselected items
            else {
              const newSelections = currentPageIds.filter(
                id => !allSelectedKeys.includes(id)
              );
              handleSelectChange(newSelections);
            }
          },
        },
        {
          key: "3",
          label: "Clear current page",
          onClick: () => {
            const currentPageIds = data.map((item) => item._id);
            const selectionsFromOtherPages = allSelectedKeys.filter(
              id => !currentPageIds.includes(id)
            );
            setAllSelectedKeys(selectionsFromOtherPages);
            onSelectionChange(selectionsFromOtherPages);
          },
        },
        {
          key: "4",
          label: "Clear all pages",
          onClick: () => {
            setAllSelectedKeys([]);
            onSelectionChange([]);
          },
        },
        {
          type: "divider",
        },
        {
          key: "5",
          label: "Select Odd Rows",
          onClick: () => {
            const oddKeys = data
              .filter((_, index) => index % 2 === 0)
              .map((item) => item._id);
            handleSelectChange(oddKeys);
          },
        },
        {
          key: "6",
          label: "Select Even Rows",
          onClick: () => {
            const evenKeys = data
              .filter((_, index) => index % 2 === 1)
              .map((item) => item._id);
            handleSelectChange(evenKeys);
          },
        },
      ]}
    />
  );

  const columns = [
    {
      title: t("member_name"),
      dataIndex: ["data", "personalInfo", "memberName"],
      key: "memberName",
      width: 150,
      fixed: "left",
    },
    {
      title: t("alias_name"),
      dataIndex: ["data", "personalInfo", "aliasName"],
      key: "aliasName",
      width: 120,
    },
    {
      title: t("gender"),
      dataIndex: ["data", "personalInfo", "gender"],
      key: "gender",
      width: 100,
      render: (text, record) =>
        `${
          record.data.personalInfo.gender?.name == "Select Option"
            ? "-"
            : record.data.personalInfo.gender?.name || "-"
        }`,
    },
    {
      title: t("marital_status"),
      dataIndex: ["data", "personalInfo", "maritalStatus"],
      key: "maritalStatus",
      width: 150,
      render: (text, record) =>
        `${
          record.data.personalInfo.maritalStatus?.name == "Select Option"
            ? "-"
            : record.data.personalInfo.maritalStatus?.name || "-"
        }`,
    },
    {
      title: t("membership"),
      dataIndex: ["data", "membershipInfo", "membership"],
      key: "membership",
      width: 150,
      render: (text, record) =>
        `${
          record.data.membershipInfo.membership?.name == "Select Option"
            ? "-"
            : record.data.membershipInfo.membership?.name || "-"
        }`,
    },
    {
      title: t("branch"),
      dataIndex: ["data", "membershipInfo", "branch"],
      key: "branch",
      width: 120,
      render: (text, record) =>
        `${
          record.data.membershipInfo.branch?.name == "Select Option"
            ? "-"
            : record.data.membershipInfo.branch?.name || "-"
        }`,
    },
    {
      title: t("phone"),
      dataIndex: ["data", "contactInfo", "phone"],
      key: "phone",
      width: 150,
    },
    {
      title: t("email"),
      dataIndex: ["data", "contactInfo", "email"],
      key: "email",
      width: 200,
    },
    {
      title: t("home_address"),
      dataIndex: ["data", "addressInfo", "homeAddress", "street"],
      key: "homeAddress",
      width: 400,
      render: (text, record) => {
        const homeAddress = record?.data?.addressInfo?.homeAddress || {};
        const street = homeAddress?.street || "-";
        const city = homeAddress?.city?.name || "";
        const state = homeAddress?.state?.name || "";
        const country = homeAddress?.country?.name || "";

        return `${street}, ${city}, ${state}, ${country}`;
      },
    },
    {
      title: t("occupation"),
      dataIndex: ["data", "otherInfo", "occupation"],
      key: "occupation",
      width: 150,
    },
    {
      title: t("pan_number"),
      dataIndex: ["data", "otherInfo", "panNumber"],
      key: "panNumber",
      width: 150,
    },
    {
      title: t("special_remark"),
      dataIndex: ["data", "otherInfo", "specialRemark"],
      key: "specialRemark",
      width: 200,
    },
    {
      title: t("action"),
      key: "action",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <div className="d-flex gap-2">
          <img
            src={eyeIcon}
            style={{ width: "20px", cursor: "pointer" }}
            onClick={() => history.push(`/member/profile/${record._id}`)}
          />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: allSelectedKeys,
    onChange: handleSelectChange,
    selections: false,
    columnTitle: (
      <Dropdown overlay={selectionMenu} trigger={["click"]}>
        <div style={{ cursor: "pointer" }}>☰</div>
      </Dropdown>
    ),
  };

  return (
    <div>
      {allSelectedKeys.length > 0 && (
        <div className="mb-2 text-sm text-gray-600">
          Total selected: {allSelectedKeys.length}
        </div>
      )}
      <Table
        className="commitmentListTable"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{ offsetHeader: 64 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: onChangePage,
          onShowSizeChange: (current, size) => onChangePageSize(size),
          showSizeChanger: true,
        }}
        bordered
      />
    </div>
  );
}

export default MemberShipListTable;