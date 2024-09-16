import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import "react-phone-number-input/style.css";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import "../../assets/scss/viewCommon.scss";
import "../../assets/scss/viewCommon.scss";
import AddForm from "../../components/membership/AddForm";
import { createMember, getMemberSchema } from "../../api/membershipApi";
import { useQuery } from "@tanstack/react-query";
export default function AddMemberForm() {
  const history = useHistory();
  const handleCreateDonation = async (payload) => {
    return createMember(payload);
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

  const generateValidationSchema = (schemaJson) => {
    const staticValidationSchema = {
      addLine1: Yup.string().required("Address Line 1 is required"),
      addLine2: Yup.string().required("Address Line 2 is required"), // Optional, but you can add rules if needed
      country: Yup.mixed().required("Country is required"),
      state: Yup.mixed().required("State is required"),
      city: Yup.mixed().required("City is required"),
      district: Yup.string().required("District is required"),
      pincode: Yup.string().matches(/^\d{6}$/, "Pincode must be 6 digits"),
      pin: Yup.mixed().required("PIN is required"),
    };

    const createYupField = (field) => {
      const type = field.type;
      const format = field.format;
      const isRequired = field.isRequired;
      const title = field.title;
      let validator = Yup.mixed(); // Default validator

      switch (type) {
        case "string":
          validator =  Yup.mixed();
          
          // if (format === "email") {
          //   validator = validator.email("Must be a valid email");
          // } else if (format === "number") {
          //   validator = validator.matches(/^\d+$/, "Must be a number");
          // } else if (format === "date") {
          //   validator = validator.matches(
          //     /^\d{4}-\d{2}-\d{2}$/,
          //     "Must be a valid date"
          //   );
          // }
          break;
        case "number":
          validator = Yup.number();
          break;
        case "boolean":
          validator = Yup.boolean();
          break;
        default:
          validator = Yup.mixed();
          break;
      }

      if (isRequired) {
        validator = validator.required(`${title} is required`);
      }

      return validator;
    };

    const createSchema = (properties) => {
      const shape = {};

      for (const [key, field] of Object.entries(properties)) {
        const prop = field.properties;
        if (prop) {
          for (const [fieldKey, fieldSchema] of Object.entries(prop)) {
            shape[fieldKey] = createYupField(fieldSchema);
          }
        } else {
          shape[key] = createYupField(field);
        }
      }

      return shape;
    };
    const dynamicValidationSchema = Yup.object().shape(
      createSchema(schemaJson?.properties ?? {})
    );

    return Yup.object().shape({
      ...staticValidationSchema, // Add static fields validation
      ...dynamicValidationSchema.fields, // Add dynamically generated fields validation
    });
  };

  const validationSchema = generateValidationSchema(memberSchema);

  const initialValues = {
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
  return (
    <div className="listviewwrapper">
      <div className="d-flex justify-content-between align-items-center ">
        <div className="d-flex justify-content-between align-items-center ">
          <img
            src={arrowLeft}
            className="me-2  cursor-pointer"
            onClick={() => history.push("/membership")}
          />
          <div className="addAction">
            <Trans i18nKey={"add_memberShip_member"} />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <AddForm
          handleSubmit={handleCreateDonation}
          initialValues={initialValues}
          validationSchema={validationSchema}
        />
      </div>
    </div>
  );
}
