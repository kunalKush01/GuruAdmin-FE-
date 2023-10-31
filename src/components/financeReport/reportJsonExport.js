import he from "he";
import moment from "moment";
import React from "react";
import { ConverFirstLatterToCapital } from "../../utility/formater";

export const ConvertToString = (html) => {
  return html.replace(/(&lt;([^>]+)>)/gi, "");
};

export const jsonDataExpences = ({ data }) => {
  return data.map((item) => ({
    title: ConverFirstLatterToCapital(item?.title),
    // description:<div className=" d-flex tableDes" dangerouslySetInnerHTML={{__html:he?.decode(item.description)}} />,
    description: ConvertToString(item?.description ?? ""),
    createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
    date: moment(item?.expenseDate).format("DD MMM YYYY"),
    amount: `₹${item.amount}`,
  }));
};

export const jsonDataDonation = ({ data }) => {
  return data.map((item) => ({
    username: ConverFirstLatterToCapital(item?.user?.name ?? ""),
    mobileNumber: item?.user?.mobileNumber,
    donarName: ConverFirstLatterToCapital(item?.donarName ?? item.user?.name),
    category: `${ConverFirstLatterToCapital(item?.masterCategory?.name)}`,
    subCategory: `${item?.category?.name ?? "-"}`,
    dateTime: moment(item.createdAt ?? item?.updatedAt).format(
      " DD MMM YYYY,hh:mm"
    ),
    amount: `₹ ${item?.amount}`,
    commitmentID: item.commitmentId
      ? item.commitmentId < 10
        ? `0${item.commitmentId}`
        : `${item.commitmentId}`
      : "_",
    createdBy: ConverFirstLatterToCapital(item?.createdBy?.name ?? ""),
  }));
};

export const jsonDataCommitment = ({ data }) => {
  return data.map((item) => ({
    username: ConverFirstLatterToCapital(item?.user?.name ?? ""),
    mobileNumber: item?.user?.mobileNumber,
    donarName: ConverFirstLatterToCapital(item?.donarName ?? item.user?.name),
    category: `${ConverFirstLatterToCapital(item?.masterCategory?.name)}`,
    subCategory: `${item?.category?.name ?? "-"}`,
    endDate: moment(item?.commitmentEndDate).format("DD MMM YYYY"),
    status: ConverFirstLatterToCapital(item?.paidStatus),
    amount: `₹ ${item?.amount}`,
    amountDue: `₹ ${item?.amount - item.paidAmount}`,
    commitmentID: item.commitmentId
      ? item.commitmentId < 10
        ? `0${item.commitmentId}`
        : `${item.commitmentId}`
      : "_",
    createdBy: ConverFirstLatterToCapital(item?.createdBy.name),
  }));
};

export const jsonDataDonationBox = ({ data }) => {
  return data.map((item) => ({
    amount: `₹${item.amount}`,
    // remarks:<div className="d-flex tableDes" dangerouslySetInnerHTML={{__html:he?.decode(item?.remarks??"")}} /> ,
    remarks: item?.remarks,
    dateTime: moment(item?.collectionDate).format("h:mm A, DD MMM YYYY"),
    createdBy: ConverFirstLatterToCapital(item?.createdBy?.name),
  }));
};
