import React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as Yup from "yup";

import { createCattleInfo } from "../../../../api/cattle/cattleInfo";
import arrowLeft from "../../../../assets/images/icons/arrow-left.svg";
import AddCattleForm from "../../../../components/cattleInfo/addForm";
import "../../../../assets/scss/viewCommon.scss";
import "../../../../assets/scss/common.scss";

export const cattleType = [
  {
    label: "Cow",
    value: "cow",
  },
  {
    label: "Bull",
    value: "bull",
  },
  {
    label: "Calf",
    value: "calf",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const cattleSource = [
  {
    label: "Owner",
    value: "owner",
  },
  {
    label: "Gaurakshak",
    value: "gaurakshak",
  },
  {
    label: "Police",
    value: "police",
  },
  {
    label: "Other",
    value: "other",
  },
];

const AddCattle = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentStatus = searchParams.get("status");
  // const currentBreed = searchParams.get("breed");
  const currentFilter = searchParams.get("filter");

  const handleCreateCattleInfo = async (payload) => {
    return createCattleInfo(payload);
  };

  const schema = Yup.object().shape({
    tagId: Yup.string().required("cattle_tag_id_required"),
    type: Yup.mixed().required("cattle_type_required"),
    breed: Yup.mixed().required("cattle_breed_required"),
    age: Yup.string().required("cattle_age_required"),
    purchasePrice: Yup.string().required("cattle_purchase_price_required"),
    source: Yup.mixed().required("cattle_source_required"),
    ownerName: Yup.string().required("cattle_owner_name_required"),
    ownerMobile: Yup.string().required("expenses_mobile_required"),
    ownerId: Yup.string().required("cattle_owner_id_required"),
    deathReason: Yup.string().when("isDead", {
      is: "YES",
      then: Yup.string().required("cattle_deathReason_required"),
      otherwise: Yup.string(),
    }),
    milkQuantity: Yup.string().when("isMilking", {
      is: "YES",
      then: Yup.string().required("cattle_milk_quantity_required"),
      otherwise: Yup.string(),
    }),

    purchaserId: Yup.string().when("isSold", {
      is: "YES",
      then: Yup.string().required("cattle_purchaser_id_required"),
      otherwise: Yup.string(),
    }),
    purchaserName: Yup.string().when("isSold", {
      is: "YES",
      then: Yup.string().required("cattle_purchaser_name_required"),
      otherwise: Yup.string(),
    }),
    purchaserMobile: Yup.string().when("isSold", {
      is: "YES",
      then: Yup.string().required("expenses_mobile_required"),
      otherwise: Yup.string(),
    }),
    soldPrice: Yup.string().when("isSold", {
      is: "YES",
      then: Yup.string().required("cattle_sold_price_required"),
      otherwise: Yup.string(),
    }),
  });

  const initialValues = {
    tagId: "",
    motherId: "",
    type: "",
    breed: "",
    soldDate: new Date(),
    dob: "",
    purchaseDate: new Date(),
    deathDate: new Date(),
    deliveryDate: new Date(),
    pregnancyDate: new Date(),
    deathReason: "",
    purchasePrice: "",
    source: "",
    ownerName: "",
    ownerCountryName: "",
    ownerCountryCode: "",
    ownerMobile: "",
    ownerId: "",
    cattleImage: "",
    ownerImage: "",
    age: "",
    isDead: "NO",
    isPregnant: "NO",
    isSold: "NO",
    isMilking: "NO",
    purchaserName: "",
    purchaserCountryCode: "",
    purchaserDialCode: "",
    purchaserMobile: "",
    purchaserId: "",
    soldPrice: "",
    milkQuantity: "",
  };

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => navigate(`/cattle/info`)}
          />
          <div className="addAction">
            <Trans i18nKey={"cattle_add"} />
          </div>
        </div>
      </div>
      <AddCattleForm
        handleSubmit={handleCreateCattleInfo}
        initialValues={initialValues}
        validationSchema={schema}
        buttonName="cattle_add"
        cattleType={cattleType}
        cattleSource={cattleSource}
      />
    </div>
  );
};

export default AddCattle;
