import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import avtarIcon from "../../../assets/images/icons/dashBoard/defaultAvatar.svg";
import CustomDataTable from "../../../components/partials/CustomDataTable";
import { ConverFirstLatterToCapital } from "../../../utility/formater";
import "../../../assets/scss/viewCommon.scss";
export default function RecentRegisteredCattlesTable({ data }) {
  // const handleDeleteExpenses = async (payload) => {
  //   return deleteExpensesDetail(payload);
  // };
  // const deleteMutation = useMutation({
  //   mutationFn: handleDeleteExpenses,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       queryClient.invalidateQueries(["Expenses"]);
  //     }
  //   },
  // });
  const { t } = useTranslation();

  const columns = [
    {
      name: t("cattle_id"),
      selector: (row) => row.cattleId,
    },
    {
      name: t("cattle_photo"),
      selector: (row) => row.cowPhoto,
    },
    {
      name: t("cattle_photo"),
      selector: (row) => row.ownerPhoto,
    },
    {
      name: t("cattle_owner_id"),
      selector: (row) => row.ownerId,
    },
    {
      name: t("cattle_type"),
      selector: (row) => row.type,
    },
    {
      name: t("cattle_mother_id"),
      selector: (row) => row.motherId,
    },
    {
      name: t("cattle_breed"),
      selector: (row) => row.breed,
    },
    {
      name: t("cattle_date_of_birth"),
      selector: (row) => row.dateOfBirth,
    },
    {
      name: t("cattle_age"),
      selector: (row) => row.age,
    },
    {
      name: t("cattle_is_pregnant"),
      selector: (row) => row.isPregnant,
    },
    {
      name: t("cattle_pregnancy_date"),
      selector: (row) => row.pregnancyDate,
    },
    {
      name: t("cattle_is_milking"),
      selector: (row) => row.isMilking,
    },
    {
      name: t("cattle_milk_quantity"),
      selector: (row) => row.milkQuantity,
    },
  ];

  const CattlesInfo = useMemo(() => {
    return data?.map((item, idx) => {
      return {
        id: idx + 1,
        cattleId: item?.tagId,
        cowPhoto: (
          <img
            src={
              item?.user?.profilePhoto !== "" && item?.user?.profilePhoto
                ? item?.user?.profilePhoto
                : avtarIcon
            }
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
            }}
            className="rounded-circle"
          />
        ),
        ownerPhoto: (
          <img
            src={
              item?.user?.profilePhoto !== "" && item?.user?.profilePhoto
                ? item?.user?.profilePhoto
                : avtarIcon
            }
            style={{
              marginRight: "5px",
              width: "30px",
              height: "30px",
            }}
            className="rounded-circle"
          />
        ),
        ownerId: item?.ownerId,
        type: item?.type,
        motherId: item?.motherId ?? "N/A",
        breed: item?.breed,
        dateOfBirth: moment(item?.dob).format(" DD MMM YYYY"),
        age: item?.age,
        isPregnant: item?.isPregnant ? "YES" : "NO",
        isMilking: item?.isPregnant ? "YES" : "NO",
        pregnancyDate: item?.pregnancyDate
          ? moment(item?.pregnancyDate).format(" DD MMM YYYY")
          : "N/A",
        milkQuantity: item?.milkQuantity ?? "N/A",
      };
    });
  }, [data]);

  return (
    <div className="recentregisteredcattletablewrapper">
      <div className="d-flex listHeading justify-content-between">
        <p className="recentDonationHeading">
          <Trans i18nKey={"recent_registered_cattles"} />
        </p>
        <p
          onClick={() => navigate("/cattle/info")}
          className="DonationViewAll"
        >
          <Trans i18nKey={"dashboard_viewAll"} />
        </p>
      </div>
      <CustomDataTable maxHeight={100} columns={columns} data={CattlesInfo} />
    </div>
  );
}
