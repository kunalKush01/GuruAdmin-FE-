import React from "react";
import styled from "styled-components";
import CustomDataTable from "../../../components/partials/CustomDataTable";

const CattleInfoTableWrapper = styled.div`
  color: #583703 !important;
  font: normal normal bold 15px/23px Noto Sans;
  .modal-body {
    max-height: 600px !important;
    overflow: auto !important;
  }
  .tableDes p {
    margin-bottom: 0;
  }
`;

const CattleInfoTable = ({ data = [] }) => {
  const columns = [];

  return (
    <CattleInfoTableWrapper>
      <CustomDataTable maxHeight={""} columns={columns} data={data} />
    </CattleInfoTableWrapper>
  );
};

export default CattleInfoTable;
