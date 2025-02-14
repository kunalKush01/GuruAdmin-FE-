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
  const handleCreateMember = async (payload) => {
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
            if (fieldInfo.isTypePhone) {
              shape[field] = Yup.string()
              .matches(
                /^\+?[1-9]\d{1,14}$/, // This regex allows for international phone numbers (with or without country code)
                "Please enter a valid mobile number"
              )
                .required(`${fieldInfo.title} is required`);
            }
          } else {
            shape[field] = Yup.mixed().nullable();
            if (fieldInfo.isTypePhone) {
              shape[field] = Yup.string().matches(
                /^\+?[1-9]\d{1,14}$/, // This regex allows for international phone numbers (with or without country code)
                "Please enter a valid mobile number"
              );
            }
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
            const processAddress = (address) => {
              const initialValues = {};

              Object.entries(address || {}).forEach(
                ([fieldKey, fieldValue]) => {
                  // console.log(fieldKey);
                  if (typeof fieldValue === "object" && fieldValue !== null) {
                    // Handling nested objects like city, state, country with name/id
                    if (fieldValue.name && fieldValue.id) {
                      initialValues[fieldKey] = {
                        name: fieldValue.name || "",
                        id: fieldValue.id || "",
                      };
                    }
                  } else if (typeof fieldValue === "string") {
                    // Handling street (split into AddLine1 and AddLine2)
                    if (fieldKey === "street") {
                      const splitValue = fieldValue.split(" ");
                      initialValues["addLine1"] = splitValue[0] || "";
                      initialValues["addLine2"] =
                        splitValue.slice(1).join(" ") || "";
                    } else if (fieldKey === "correspondenceStreet") {
                      const splitValue = fieldValue.split(" ");
                      initialValues["correspondenceAddLine1"] =
                        splitValue[0] || "";
                      initialValues["correspondenceAddLine2"] =
                        splitValue.slice(1).join(" ") || "";
                    } else {
                      initialValues[fieldKey] = fieldValue || "";
                    }
                  } else if (typeof fieldValue == "number") {
                    if (fieldKey === "pincode") {
                      // Handle pincode
                      initialValues["pincode"] = fieldValue || "";
                      initialValues["pin"] = {
                        name: fieldValue || "",
                        id: fieldValue || "",
                      };
                    } else if (fieldKey === "correspondencePincode") {
                      // Handle correspondencePincode
                      initialValues["correspondencePincode"] = fieldValue || "";
                      initialValues["correspondencePin"] = {
                        name: fieldValue || "",
                        id: fieldValue || "",
                      };
                    }
                  }
                }
              );

              return initialValues;
            };

            // Process homeAddress and correspondenceAddress
            const homeAddressInitialValues = processAddress(field.homeAddress);
            const correspondenceAddressInitialValues = processAddress(
              field.correspondenceAddress
            );

            // Merge the results into initialValues
            Object.assign(
              initialValues,
              homeAddressInitialValues,
              correspondenceAddressInitialValues
            );
          } else {
            // Handle other objects
            Object.keys(field).forEach((fieldKey) => {
              const value = field[fieldKey];

              if (
                typeof value === "object" &&
                value !== null &&
                value.hasOwnProperty("name") &&
                value.hasOwnProperty("id")
              ) {
                // Set "Select Option" for empty name or id
                initialValues[fieldKey] = {
                  name: value.name || "Select Option",
                  id: value.id || "Select Option",
                };
              } else {
                initialValues[fieldKey] = value || "";
              }
              // initialValues[fieldKey] = field[fieldKey] || "";
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
          handleSubmit={handleCreateMember}
          initialValues={mode == "add" ? initialValues : editedInitialValues}
          validationSchema={combinedValidationSchema}
          mode={mode}
          id={id}
        />
      </div>
    </div>
  );
}
