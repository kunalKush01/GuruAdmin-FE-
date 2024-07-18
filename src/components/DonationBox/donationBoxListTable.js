import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { deleteExpensesDetail } from "../../api/expenseApi";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import CustomDataTable from "../partials/CustomDataTable";
import "../../../src/styles/common.scss";

export default function DonationBoxListTable({ data, financeReport }) {
  // const handleDeleteDonationBox = async (payload) => {
  //   return deleteExpensesDetail(payload);
  // };
  // const queryClient = useQueryClient();
  // const deleteMutation = useMutation({
  //   mutationFn: handleDeleteDonationBox,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       queryClient.invalidateQueries(["Collections"]);
  //     }
  //   },
  // });
  const { t } = useTranslation();
  const history = useHistory();

  const columns = [
    {
      name: t("dashboard_Recent_DonorAmount"),
      selector: (row) => row.amount,
      style: {
        font: "normal normal 700 13px/20px noto sans !important ",
      },
      width: "350px",
    },
    {
      name: t("dashboard_Recent_DonorDate"),
      selector: (row) => row.dateTime,
      width: "350px",
    },
    {
      name: t("remarks_financial_donationBox"),
      selector: (row) => row.remarks,
      width: "350px",
    },
    {
      name: t("created_by"),
      center: true,
      selector: (row) => row.createdBy,
    },
    {
      name: t(""),
      center: true,
      selector: (row) => row.edit,
    },
  ];

  const donatioBoxList = useMemo(() => {
    return data.map((item, idx) => ({
      _Id: item.id,
      id: `${idx + 1}`,
      amount: `₹${item?.amount.toLocaleString("en-IN")}`,
      remarks: (
        <div
          className="d-flex tableDes"
          dangerouslySetInnerHTML={{ __html: he?.decode(item?.remarks ?? "") }}
        />
      ),
      createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
      dateTime: moment(item?.collectionDate).format("DD MMM YYYY, h:mm A "),
      edit: (
        <img
          src={editIcon}
          width={35}
          className={financeReport ? "d-none" : "cursor-pointer "}
          onClick={() => {
            financeReport ? "" : history.push(`/hundi/edit/${item.id}`);
          }}
        />
      ),
    }));
  }, [data]);

;
  return (
    <div className="recentdonationtablewrapper">
      <CustomDataTable maxHeight={""} columns={columns} data={donatioBoxList} />
    </div>
  );
}
