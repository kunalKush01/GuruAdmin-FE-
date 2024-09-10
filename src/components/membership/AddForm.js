import { Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import "../../assets/scss/common.scss";
import { Country, State, City } from "country-state-city";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import pincodes from "indian-pincodes";
import FormikMemberForm from "./FormikMemberForm";
import { getMemberSchema } from "../../api/membershipApi";

export default function AddForm({
  //   handleSubmit,
  validationSchema,
  initialValues,
}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const categoryQueryClient = useQueryClient();

  const categoryMutation = useMutation({
    // mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        addDonationUser
          ? categoryQueryClient.invalidateQueries(["donations"])
          : categoryQueryClient.invalidateQueries(["subscribedUser"]);
        setLoading(false);
        onSuccess(true);
        onClose();
      } else if (data?.error) {
        setLoading(false);
        onSuccess(false);
      }
    },
  });
  const trustId = localStorage.getItem("trustId");
  const [showPrompt, setShowPrompt] = useState(true);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [districtPincode, setDistrictPincode] = useState([]);

  useEffect(() => {
    const fetchedCountry = Country.getAllCountries();
    const formattedCountry = fetchedCountry.map((country) => ({
      name: country.name,
      id: country.isoCode,
    }));
    setCountry(formattedCountry);
  }, []);

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
  const memberSchema = memberSchemaItem ? memberSchemaItem.memberSchema : null;
  return (
    <div className="FormikWrapper">
      <Formik
        initialValues={{
          ...initialValues,
        }}
        onSubmit={(e) => {
          setShowPrompt(false);
          setLoading(true);
          categoryMutation.mutate({
            pincode: e.pincode,
            searchType: e.searchType,
            panNumber: e.panNumber,
            addLine1: e.addLine1,
            addLine2: e.addLine2,
            city: e.city.name,
            district: e.district,
            state: e.state.name,
            country: e.country.name,
            pin: e.pin,
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values.location) {
              formik.setFieldValue("pincode", "");
            }
          }, [formik.values.location]);
          useEffect(() => {
            if (formik.values.pincode) {
              formik.setFieldValue("location", "");
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
          }, [formik.values.district, formik.values.location]);

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
                formik.setFieldValue("pin", selectedPIN || "");
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
            />
          );
        }}
      </Formik>
    </div>
  );
}
