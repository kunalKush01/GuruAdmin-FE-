import { Table } from "antd";
import React from "react";
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
}) {
  const history = useHistory();
  const { t } = useTranslation();
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
      width: 120,
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
      width: 200,
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

  return (
    <div>
      <Table
        className="commitmentListTable"
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
