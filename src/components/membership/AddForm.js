import { Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss";
import { Country, State, City } from "country-state-city";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pincodes from "indian-pincodes";
import FormikMemberForm from "./FormikMemberForm";
import { getMemberSchema } from "../../api/membershipApi";
import { useSelector } from "react-redux";

export default function AddForm({
  handleSubmit,
  initialValues,
  plusIconDisable = false,
  validationSchema,
  mode,
  id,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const trustId = localStorage.getItem("trustId");
  const loggedInUser = useSelector((state) => state.auth.userDetail);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (mode == "edit") {
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  }, [mode == "edit"]);
  const categoryMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["memberShipListData"]);
        mode == "add"
          ? navigate("/membership")
          : navigate(`/member/profile/${id}`);
        setLoading(false);
        // onClose();
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const [showPrompt, setShowPrompt] = useState(true);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [districtPincode, setDistrictPincode] = useState([]);

  const [correspondenceStates, setCorrespondaceStates] = useState([]);
  const [correspondenceCountry, setCorrespondaceCountry] = useState([]);
  const [correspondenceCity, setCorrespondaceCity] = useState([]);
  const [correspondenceDistrictPincode, setCorrespondaceDistrictPincode] =
    useState([]);

  useEffect(() => {
    const fetchedCountry = Country.getAllCountries();
    const formattedCountry = fetchedCountry.map((country) => ({
      name: country.name,
      id: country.isoCode,
    }));
    setCountry(formattedCountry);
    setCorrespondaceCountry(formattedCountry);
  }, []);
  const memberShipQuery = useQuery(
    ["memberShipSchema"],
    () => getMemberSchema(),
    {
      enabled: editMode,
      keepPreviousData: true,
    }
  );

  const memberSchemaItem = useMemo(
    () => memberShipQuery?.data?.schema ?? [],
    [memberShipQuery]
  );
  const memberSchema = memberSchemaItem ? memberSchemaItem.memberSchema : {};

  const generatePayloadFromForm = (schema, formData) => {
    if (!schema || typeof schema !== "object") {
      return {};
    }

    let payload = {};

    Object.keys(schema).forEach((key) => {
      const field = schema[key];
      const formValue = formData[key];
      if (key === "correspondenceAddress" || key === "homeAddress") {
        if (field.type === "object" && field.properties) {
          payload[key] = Object.keys(field.properties).reduce(
            (addressPayload, subKey) => {
              if (subKey === "street") {
                addressPayload[subKey] = `${formData.addLine1 || ""} ${
                  formData.addLine2 || ""
                }`.trim();
              } else if (subKey === "correspondenceStreet") {
                addressPayload[subKey] = `${
                  formData.correspondenceAddLine1 || ""
                } ${formData.correspondenceAddLine2 || ""}`.trim();
              } else if (typeof formData[subKey] === "object") {
                // Handle nested objects dynamically
                addressPayload[subKey] = {
                  name: formData[subKey]?.name || "",
                  id: formData[subKey]?.id || "",
                };
              } else {
                // Handle other fields
                addressPayload[subKey] = formData[subKey] || "";
              }
              return addressPayload;
            },
            {}
          );
        }
      }
      else if (key === "familyInfo") {
        return;
      } else if (field.type === "object" && field.properties) {
        payload[key] = generatePayloadFromForm(field.properties, formData);
      } else if (
        field.type === "array" &&
        field.items &&
        field.items.properties
      ) {
        payload[key] = formValue.map((item) =>
          generatePayloadFromForm(field.items.properties, item)
        );
      } else {
        payload[key] = formValue !== undefined ? formValue : "";
      }
    });
    // console.log(payload)
    return payload;
  };
  return (
    <div className="FormikWrapper">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(formData) => {
          const payload = {
            trustId: trustId && trustId,
            createdByUserId: loggedInUser && loggedInUser.id,
            memberType: "Member",
            data: memberSchema
              ? generatePayloadFromForm(memberSchema.properties, formData)
              : {},
          };
          setShowPrompt(false);
          setLoading(true);
          categoryMutation.mutate(payload);
        }}
      >
        {(formik) => {
          {
            /* home address */
          }
          useEffect(() => {
            if (formik.values.homeLocation) {
              formik.setFieldValue("pincode", "");
            }
          }, [formik.values.homeLocation]);
          useEffect(() => {
            if (formik.values.pincode) {
              formik.setFieldValue("homeLocation", "");
            }
          }, [formik.values.pincode]);
          useEffect(() => {
            if (formik.values.district) {
              const districtPincodes = pincodes.getPincodesByDistrict(
                formik.values.district.split(" ")[0]
              );
              if (
                Array.isArray(districtPincodes) &&
                districtPincodes.length > 0
              ) {
                const uniquePincodes = districtPincodes.reduce(
                  (acc, current) => {
                    const isDuplicate = acc.find(
                      (item) => item.pincode === current.pincode
                    );
                    if (!isDuplicate) {
                      acc.push(current);
                    }
                    return acc;
                  },
                  []
                );

                const formattedPincodes = uniquePincodes.map((code) => ({
                  name: code.pincode,
                  id: code.pincode,
                }));
                setDistrictPincode(formattedPincodes);
              } else {
                setDistrictPincode([]);
              }
            }
          }, [formik.values.district, formik.values.homeLocation]);

          useEffect(() => {
            if (formik.values.pincode) {
              const details = pincodes.getPincodeDetails(
                Number(formik.values.pincode)
              );
              if (details) {
                const districtPincodes = pincodes.getPincodesByDistrict(
                  details.district
                );
                const uniquePincodes = districtPincodes.reduce(
                  (acc, current) => {
                    const isDuplicate = acc.find(
                      (item) => item.pincode === current.pincode
                    );
                    if (!isDuplicate) {
                      acc.push(current);
                    }
                    return acc;
                  },
                  []
                );

                const formattedPincodes = uniquePincodes.map((code) => ({
                  name: code.pincode,
                  id: code.pincode,
                }));
                setDistrictPincode(formattedPincodes);
                const selectedCountry = country.find(
                  (c) => c.name === details.country
                );
                const selectedState = states.find(
                  (c) => c.name === details.state
                );
                const selectedCity = city.find((c) =>
                  details.region.includes(c.name.trim())
                );
                const selectedPIN = formattedPincodes.find(
                  (c) => c.name === details.pincode
                );

                formik.setFieldValue("city", selectedCity || "");
                formik.setFieldValue("district", details.district || "");
                formik.setFieldValue("country", selectedCountry || "");
                {/* formik.setFieldValue("pin", selectedPIN || ""); */}
                formik.setFieldValue("state", selectedState || "");
              } else {
                formik.setFieldValue("city", "");
                formik.setFieldValue("district", "");
                formik.setFieldValue("country", "");
                formik.setFieldValue("pin", "");
                formik.setFieldValue("state", "");
              }
            }
          }, [formik.values.pincode, country, pincodes, states, city]);
          useEffect(() => {
            if (formik.values.country) {
              const fetchedStates = State.getStatesOfCountry(
                formik.values.country.id
              );
              const formattedStates = fetchedStates.map((state) => ({
                name: state.name,
                id: state.isoCode,
              }));
              setStates(formattedStates);
              {
                /* formik.setFieldValue("state", null); */
              }
              {
                /* formik.setFieldValue("city", null); */
              }
            } else {
              setStates([]);
              setCity([]);
            }
          }, [formik.values.country]);
          useEffect(() => {
            if (formik.values.state) {
              const fetchedCities = City.getCitiesOfState(
                formik.values.country.id,
                formik.values.state.id
              );
              const formattedCities = fetchedCities.map((city) => ({
                name: city.name,
                id: city.name,
              }));
              setCity(formattedCities);
            } else {
              setCity([]);
            }
          }, [formik.values.state]);

          {
            /* correspondace address */
          }
          useEffect(() => {
            if (formik.values.correspondenceLocation) {
              formik.setFieldValue("correspondencePincode", "");
            }
          }, [formik.values.correspondenceLocation]);

          useEffect(() => {
            if (formik.values.correspondencePincode) {
              formik.setFieldValue("correspondenceLocation", "");
            }
          }, [formik.values.correspondencePincode]);

          useEffect(() => {
            if (formik.values.correspondenceDistrict) {
              const districtPincodes = pincodes.getPincodesByDistrict(
                formik.values.correspondenceDistrict.split(" ")[0]
              );
              if (
                Array.isArray(districtPincodes) &&
                districtPincodes.length > 0
              ) {
                const uniquePincodes = districtPincodes.reduce(
                  (acc, current) => {
                    const isDuplicate = acc.find(
                      (item) => item.pincode === current.pincode
                    );
                    if (!isDuplicate) {
                      acc.push(current);
                    }
                    return acc;
                  },
                  []
                );

                const formattedPincodes = uniquePincodes.map((code) => ({
                  name: code.pincode,
                  id: code.pincode,
                }));
                setCorrespondaceDistrictPincode(formattedPincodes);
              } else {
                setCorrespondaceDistrictPincode([]);
              }
            }
          }, [
            formik.values.correspondenceDistrict,
            formik.values.correspondenceLocation,
          ]);

          useEffect(() => {
            if (formik.values.correspondencePincode) {
              const details = pincodes.getPincodeDetails(
                Number(formik.values.correspondencePincode)
              );
              if (details) {
                const districtPincodes = pincodes.getPincodesByDistrict(
                  details.district
                );
                const uniquePincodes = districtPincodes.reduce(
                  (acc, current) => {
                    const isDuplicate = acc.find(
                      (item) => item.pincode === current.pincode
                    );
                    if (!isDuplicate) {
                      acc.push(current);
                    }
                    return acc;
                  },
                  []
                );

                const formattedPincodes = uniquePincodes.map((code) => ({
                  name: code.pincode,
                  id: code.pincode,
                }));
                setCorrespondaceDistrictPincode(formattedPincodes);
                const selectedCountry = correspondenceCountry.find(
                  (c) => c.name === details.country
                );
                const selectedState = correspondenceStates.find(
                  (c) => c.name === details.state
                );
                const selectedCity = correspondenceCity.find((c) =>
                  details.region.includes(c.name.trim())
                );
                const selectedPIN = formattedPincodes.find(
                  (c) => c.name === details.pincode
                );

                formik.setFieldValue("correspondenceCity", selectedCity || "");
                formik.setFieldValue(
                  "correspondenceDistrict",
                  details.district || ""
                );
                formik.setFieldValue(
                  "correspondenceCountry",
                  selectedCountry || ""
                );
                {/* formik.setFieldValue("correspondencePin", selectedPIN || ""); */}
                formik.setFieldValue(
                  "correspondenceState",
                  selectedState || ""
                );
              } else {
                formik.setFieldValue("correspondenceCity", "");
                formik.setFieldValue("correspondenceDistrict", "");
                formik.setFieldValue("correspondenceCountry", "");
                formik.setFieldValue("correspondencePin", "");
                formik.setFieldValue("correspondenceState", "");
              }
            }
          }, [
            formik.values.correspondencePincode,
            correspondenceCountry,
            pincodes,
            correspondenceStates,
            correspondenceCity,
          ]);
          useEffect(() => {
            if (formik.values.correspondenceCountry) {
              const fetchedStates = State.getStatesOfCountry(
                formik.values.correspondenceCountry.id
              );
              const formattedStates = fetchedStates.map((state) => ({
                name: state.name,
                id: state.isoCode,
              }));
              setCorrespondaceStates(formattedStates);
              {
                /* formik.setFieldValue("state", null); */
              }
              {
                /* formik.setFieldValue("city", null); */
              }
            } else {
              setCorrespondaceStates([]);
              setCorrespondaceCity([]);
            }
          }, [formik.values.correspondenceCountry]);
          useEffect(() => {
            if (formik.values.correspondenceState) {
              const fetchedCities = City.getCitiesOfState(
                formik.values.correspondenceCountry.id,
                formik.values.correspondenceState.id
              );
              const formattedCities = fetchedCities.map((city) => ({
                name: city.name,
                id: city.name,
              }));
              setCorrespondaceCity(formattedCities);
            } else {
              setCorrespondaceCity([]);
            }
          }, [formik.values.correspondenceState]);
          return (
            <FormikMemberForm
              formik={formik}
              schema={memberSchema}
              loading={loading}
              plusIconDisable
              showPrompt={showPrompt}
              states={states}
              country={country}
              city={city}
              districtPincode={districtPincode}
              correspondenceStates={correspondenceStates}
              correspondenceCountry={correspondenceCountry}
              correspondenceCity={correspondenceCity}
              correspondenceDistrictPincode={correspondenceDistrictPincode}
              mode={mode}
            />
          );
        }}
      </Formik>
    </div>
  );
}
