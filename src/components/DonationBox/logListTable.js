import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CustomDataTable from "../partials/CustomDataTable";
import '../../../src/styles/common.scss';
export default function LogListTable({ data }) {
  const { t } = useTranslation();

  const columns = [
    {
      name: t("logData_editedBy"),
      selector: (row) => row.editedBy,
    },
    {
      name: t("logData_createdBy"),
      selector: (row) => row.createdBy,
      // width:"150px",
    },
    {
      name: t("logData_timeDate"),
      selector: (row) => row.timeDate,
      // width:"150px",
    },

    {
      name: t("logData_createdAmount"),
      selector: (row) => row.createdAmount,
    },

    {
      name: t("logData_editedAmount"),
      selector: (row) => row.editedAmount,
    },
  ];

  const logData = useMemo(() => {
    return data.map((item, idx) => {
      return {
        id: idx + 1,
        editedBy: item?.updatedUser?.name,
        createdBy: item?.createdUser?.name,
        timeDate: moment(item.createdAt).format(" DD MMM YYYY,hh:mm A"),
        createdAmount: item?.oldAmount,
        editedAmount: item?.amount,
      };
    });
  });

  const LogListTableWarper = styled.div``;
;

  return (
    <div className="loglisttablewarper">
      <CustomDataTable columns={columns} maxHeight="350px" data={logData} />
    </div>
  );
}
