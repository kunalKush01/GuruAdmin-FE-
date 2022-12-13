import { useQuery } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import * as yup from "yup";
import { getExpensesDetail, updateExpensesDetail } from "../../api/expenseApi";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import ExpensesForm from "../../components/internalExpenses/expensesForm";

const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }
`;

const handleCreateExpense = async (payload) => {
  return updateExpensesDetail(payload);
};
const schema = yup.object().shape({
  Title: yup.string().required("news_title_required"),
  AddedBy: yup.string().required("news_tags_required"),
  Amount: yup.string().required("news_tags_required"),
  Body: yup.string().required("news_desc_required"),
  DateTime: yup.string(),
});

export default function AddNews() {
  const history = useHistory();
  const langArray = useSelector((state) => state.auth.availableLang);
  const { expensesId } = useParams();
  console.log("expensesId=", expensesId);

  const ExpensesDetailQuery = useQuery(
    ["ExpensesDetail", expensesId],
    async () => await getExpensesDetail(expensesId)
  );
  
  const initialValues = {
    Id:ExpensesDetailQuery?.data?.result?.id,
    Title: ExpensesDetailQuery?.data?.result?.title ?? "",
    AddedBy: ExpensesDetailQuery?.data?.result?.createdBy?.name ?? "lalit",
    Body: he.decode(ExpensesDetailQuery?.data?.result?.description ?? ""),
    Amount: ExpensesDetailQuery?.data?.result?.amount ?? "",
    DateTime: moment(ExpensesDetailQuery?.data?.result?.expenseDate)
      .utcOffset("+0530")
      .toDate(),
  };
  return (
    <NewsWarper>
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/internal_expenses")}
          />
          <div className="addNews">
            <Trans i18nKey={"expenses_EditExpenses"} />
          </div>
        </div>
        {/* <div className="addNews">
          <Trans i18nKey={"news_InputIn"} />
          <CustomDropDown
            ItemListArray={langArray}
            className={"ms-1"}
            defaultDropDownName={"English"}
            disabled
          />
        </div> */}
      </div>

      {!ExpensesDetailQuery.isLoading ? (
        <ExpensesForm
          handleSubmit={handleCreateExpense}
          initialValues={initialValues}
          vailidationSchema={schema}
          showTimeInput
          buttonName="expenses_AddExpenses"
        />
      ) : (
        ""
      )}
    </NewsWarper>
  );
}
