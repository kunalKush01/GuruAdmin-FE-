import { Table } from "antd";
import React from "react";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import eyeIcon from "../../assets/images/icons/signInIcon/Icon awesome-eye.svg";
import { useHistory } from "react-router-dom";

function MemberShipListTable({ data }) {
  const history = useHistory();
  const columns = [
    {
      title: "Name",
      dataIndex: "memberName",
      key: "memberName",
      width: 100,
    },
    {
      title: "Alias Name",
      dataIndex: "aliasName",
      key: "aliasName",
      width: 100,
    },
    {
      title: "Membership Status",
      dataIndex: "membershipStatus",
      key: "membershipStatus",
      width: 100,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width:100,
      render: (text, record) => (
        <div className="d-flex gap-2">
          <img
            src={eyeIcon}
            style={{ width: "20px", cursor: "pointer" }}
            onClick={() =>
                history.push(
                  `/member/profile`
                )
              }
          />
        </div>
      ),
    },
  ];

  const handleEdit = (key) => {
    console.log("Edit", key);
    // Handle edit logic here
  };

  const handleDelete = (key) => {
    console.log("Delete", key);
    // Handle delete logic here
  };

  return (
    <div>
      <Table
        className="commitmentListTable"
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1500,
          y: 400,
        }}
        sticky={{
          offsetHeader: 64,
        }}
        bordered
      />
    </div>
  );
}

export default MemberShipListTable;
