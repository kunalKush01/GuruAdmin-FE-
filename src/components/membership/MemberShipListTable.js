import { Table } from "antd";
import React from "react";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useHistory } from "react-router-dom";

function MemberShipListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  onChangePage,
  onChangePageSize,
}) {
  const history = useHistory();

  const columns = [
    {
      title: "Member Name",
      dataIndex: ["data", "personalInfo", "memberName"],
      key: "memberName",
      width: 150,
      fixed: "left",
    },
    {
      title: "Alias Name",
      dataIndex: ["data", "personalInfo", "aliasName"],
      key: "aliasName",
      width: 120,
      fixed: "left",
    },
    {
      title: "Gender",
      dataIndex: ["data", "personalInfo", "gender"],
      key: "gender",
      width: 100,
      render: (text, record) => `${record.data.personalInfo.gender?.name ||"-"}`,
    },
    {
      title: "Marital Status",
      dataIndex: ["data", "personalInfo", "maritalStatus"],
      key: "maritalStatus",
      width: 150,
      render: (text, record) =>
        `${record.data.personalInfo.maritalStatus?.name ||"-"}`,
    },
    {
      title: "Membership",
      dataIndex: ["data", "membershipInfo", "membership"],
      key: "membership",
      width: 150,
      render: (text, record) => `${record.data.membershipInfo.membership?.name ||"-"}`
    },
    {
      title: "Branch",
      dataIndex: ["data", "membershipInfo", "branch"],
      key: "branch",
      width: 120,
      render: (text, record) => `${record.data.membershipInfo.branch?.name ||"-"}`,
    },
    {
      title: "Phone",
      dataIndex: ["data", "contactInfo", "phone"],
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: ["data", "contactInfo", "email"],
      key: "email",
      width: 200,
    },
    {
      title: "Home Address",
      dataIndex: ["data", "addressInfo", "homeAddress", "street"],
      key: "homeAddress",
      width: 200,
      render: (text, record) =>
        `${record.data.addressInfo.homeAddress.street ||"-"}, ${record.data.addressInfo.homeAddress.city?.name ||""}, ${record.data.addressInfo.homeAddress.state?.name ||""}, ${record.data.addressInfo.homeAddress.country?.name  ||""}`,
    },
    {
      title: "Occupation",
      dataIndex: ["data", "otherInfo", "occupation"],
      key: "occupation",
      width: 150,
    },
    {
      title: "PAN Number",
      dataIndex: ["data", "otherInfo", "panNumber"],
      key: "panNumber",
      width: 150,
    },
    {
      title: "Special Remark",
      dataIndex: ["data", "otherInfo", "specialRemark"],
      key: "specialRemark",
      width: 200,
    },
    {
      title: "Action",
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
