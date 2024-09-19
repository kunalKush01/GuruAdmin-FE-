import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import "react-phone-number-input/style.css";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/viewCommon.scss";
import "../../assets/scss/viewCommon.scss";
import AddForm from "../../components/membership/AddForm";
import {
  createMember,
  getMembersById,
  getMemberSchema,
  updateMembersById,
} from "../../api/membershipApi";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "reactstrap";
import moment from "moment";
export default function AddMemberForm() {
  const history = useHistory();
  const { id } = useParams();
  const mode = id && id ? "edit" : "add";
  const { data, isLoading, isFetching } = useQuery(
    ["memberShipProfileData", id],
    () => getMembersById(id),
    {
      // enabled: !!id,
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching suspense data:", error);
      },
    }
  );
  const memberResultData = data ? data?.member : null;
  const handleCreateDonation = async (payload) => {
    if (mode == "edit") {
      return updateMembersById(id, payload);
    } else {
      return createMember(payload);
    }
  };
  const memberShipQuery = useQuery(
    ["memberShipSchema"],
    () => getMemberSchema(),
    {
      keepPreviousData: true,
    }
  );

  const memberSchemaItem = useMemo(
    () => memberShipQuery?.data?.schema ?? [],
    [memberShipQuery]
  );
  const memberSchema = memberSchemaItem ? memberSchemaItem.memberSchema : {};

  const staticValidationSchema = Yup.object().shape({
    addLine1: Yup.string().required("Address Line 1 is required"),
    addLine2: Yup.string().required("Address Line 2 is required"), // Optional, but you can add rules if needed
    country: Yup.mixed().required("Country is required"),
    state: Yup.mixed().required("State is required"),
    city: Yup.mixed().required("City is required"),
    district: Yup.string().required("District is required"),
    pin: Yup.mixed().required("PIN is required"),
  });
  const createYupSchema = (schema) => {
    const shape = {};
    if (schema) {
      Object.keys(schema.properties).forEach((section) => {
        if (section === "addressInfo") {
          return;
        }

        const sectionProperties = schema.properties[section].properties;
        Object.keys(sectionProperties).forEach((field) => {
          const fieldInfo = sectionProperties[field];

          if (fieldInfo.isRequired) {
            shape[field] = Yup.mixed().required(
              `${fieldInfo.title} is required`
            );

            if (fieldInfo.format === "email") {
              shape[field] = Yup.string()
                .email("Invalid email format")
                .required(`${fieldInfo.title} is required`);
            }
            if (fieldInfo.format === "date") {
              shape[field] = Yup.date().required(
                `${fieldInfo.title} is required`
              );
            }
          } else {
            shape[field] = Yup.mixed().nullable();
          }
        });
      });
    }
    return Yup.object().shape(shape);
  };
  const validate = useMemo(() => createYupSchema(memberSchema), [memberSchema]);
  const combinedValidationSchema = staticValidationSchema.concat(validate);

  //**initial values generation */
  const generateInitialValues = (schema, memberResultData) => {
    const editMemberData = memberResultData && memberResultData?.data;
    if (!schema || typeof schema !== "object") {
      return {};
    }
    let initialValues = {};
    if (mode == "add") {
      Object.keys(schema).forEach((key) => {
        const field = schema[key];
        if (field.type === "object" && field.properties) {
          Object.keys(field.properties).forEach((key) => {
            if (key == "correspondenceAddress" || key == "homeAddress") {
              return;
            }
            initialValues[key] = "";
          });
        }
      });
    } else if (mode === "edit" && editMemberData) {
      Object.keys(editMemberData).forEach((key) => {
        const field = editMemberData[key];

        if (typeof field === "object" && field !== null) {
          if (key === "addressInfo") {
            const homeLine1 = field.homeAddress?.street;
            const homeSplitValue = homeLine1.split(" ");
            const correspondaceLine1 = field.correspondenceAddress?.street;
            const correspondaceSplitValue = correspondaceLine1.split(" ");
            initialValues["addLine1"] = homeSplitValue[0] || "";
            initialValues["addLine2"] = homeSplitValue.slice(1).join(" ") || "";
            initialValues["city"] = field.homeAddress?.city || "";
            initialValues["district"] = field.homeAddress?.district || "";
            initialValues["state"] = field.homeAddress?.state || "";
            initialValues["country"] = field.homeAddress?.country || "";
            initialValues["pin"] = field.homeAddress?.pincode || "";

            initialValues["correspondenceAddLine1"] =
              correspondaceSplitValue[0] || "";
            initialValues["correspondenceAddLine2"] =
              correspondaceSplitValue.slice(1).join(" ") || "";
            initialValues["correspondenceState"] =
              field.correspondenceAddress?.state || "";
            initialValues["correspondenceCountry"] =
              field.correspondenceAddress?.country || "";
            initialValues["correspondencePin"] =
              field.correspondenceAddress?.pincode || "";
            initialValues["correspondenceCity"] =
              field.correspondenceAddress?.city || "";
            initialValues["correspondenceDistrict"] =
              field.correspondenceAddress?.district || "";
          }
          else {
            // Handle other objects
            Object.keys(field).forEach((fieldKey) => {
              initialValues[fieldKey] = field[fieldKey] || "";
            });
          }
        } else {
          initialValues[key] = field || "";
        }
      });
    }
    return initialValues;
  };
  const dynamicInitialValues = memberSchema
    ? generateInitialValues(
        memberSchema.properties,
        mode === "edit" && memberResultData
      )
    : {};
  const staticInitialValues = {
    //** Address Information */
    searchType: "",
    addLine1: "",
    addLine2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
    pin: "",

    //** Corresponding Address Information */
    correspondencePincode: "",
    correspondenceSearchType: "",
    correspondenceAddLine1: "",
    correspondenceAddLine2: "",
    correspondenceCity: "",
    correspondenceDistrict: "",
    correspondenceState: "",
    correspondenceCountry: "",
    correspondencePin: "",
  };
  const initialValues = {
    ...dynamicInitialValues,
    ...staticInitialValues,
  };
  const editedInitialValues = {
    ...dynamicInitialValues,
  };
  if (isLoading || isFetching || memberShipQuery.isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() =>
              mode == "add"
                ? history.push("/membership")
                : history.push(`/member/profile/${id}`)
            }
          />
          <div className="addAction">
            {mode == "add" ? (
              <Trans i18nKey={"add_memberShip_member"} />
            ) : (
              <Trans i18nKey={"edit_memberShip_member"} />
            )}
          </div>
        </div>
      </div>
      <div className="mt-1">
        <AddForm
          handleSubmit={handleCreateDonation}
          initialValues={mode == "add" ? initialValues : editedInitialValues}
          validationSchema={combinedValidationSchema}
          mode={mode}
          id={id}
        />
      </div>
    </div>
  );
}
