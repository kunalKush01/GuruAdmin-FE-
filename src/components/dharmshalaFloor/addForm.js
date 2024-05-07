import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";

// import {
//   findAllCattle,
//   findAllCattleBreed,
//   findAllCattleCategory,
// } from "../../api/cattle/cattleMedical";

import CustomTextField from "../partials/customTextField";
//import { ConverFirstLatterToCapital } from "../../utility/formater";

const FormikWrapper = styled.div`
  font: normal normal bold 15px/33px Noto Sans;

  .animated-height {
    transition: height 0.5s;
  }
`;

const AddDharmshalaFloorForm = ({
  initialValues,
  validationSchema,
  handleSubmit,
  buttonName,
  ...props
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(true);
  const [loading, setLoading] = useState(false);
  //   const [cattleImageName, setCattleImageName] = useState(props.cattleImageName);
  //   const [ownerImageName, setOwnerImageName] = useState(props.ownerImageName);

  //   const [phoneNumber, setPhoneNumber] = useState(getMobile ?? "");
  //   const [purchaserNumber, setPurchaserNumber] = useState(
  //    getPurchaserMobile ?? ""
  //  );

  //   const [imageSpinner, setImageSpinner] = useState(false);
  //   const [ownerImageUploading, setOwnerImageUploading] = useState(false);

  //   const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  //   const loadOption = async (tagId) => {
  //     const res = await findAllCattle({ cattleId: tagId });
  //     return res.results;
  //   };

  //   const categoriesLoadOption = async (category) => {
  //     const res = await findAllCattleCategory({ name: category });
  //     return res.results?.map((item) => {
  //       return { ...item, name: ConverFirstLatterToCapital(item?.name ?? "") };
  //     });
  //   };

  //   const breedLoadOption = async (breed) => {
  //     const res = await findAllCattleBreed({ name: breed });
  //     return res.results?.map((item) => {
  //       return { ...item, name: ConverFirstLatterToCapital(item?.name ?? "") };
  //     });
  //   };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data?.error) {
        queryClient.invalidateQueries(["dharmshalaFloorList"]);
        setLoading(false);
        history.push("/dharmshala/info");
      } else if (data?.error || data === undefined) {
        setLoading(false);
      }
    },
  });

  return (
    <FormikWrapper>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          const { ...formValues } = values;
          const data = {
            ...formValues,
          };
          mutation.mutate(data);
        }}
      >
        {(formik) => (
          <Form>
            {showPrompt && (
              <Prompt
                when={!!Object.values(formik?.values).find((val) => !!val)}
                message={(location) =>
                  `Are you sure you want to leave this page & visit ${location.pathname.replace(
                    "/",
                    ""
                  )}`
                }
              />
            )}

            <Row className="paddingForm">
              <Col xs={12} md={10}>
                {/* First Row */}
                <Row>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_floor_name")}
                      placeholder={t("placeHolder_dharmshala_floor_name")}
                      name="name"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_floor_description")}
                      placeholder={t(
                        "placeHolder_dharmshala_floor_description"
                      )}
                      name="description"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_floor_number")}
                      placeholder={t("placeHolder_dharmshala_floor_number")}
                      name="location"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="btn-Published mt-3">
              {loading ? (
                <Button
                  color="primary"
                  className="add-trust-btn"
                  style={{
                    borderRadius: "10px",
                    padding: "5px 40px",
                    opacity: "100%",
                  }}
                  disabled
                >
                  <Spinner size="md" />
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="d-flex align-items-center m-auto"
                  type="submit"
                >
                  {!props.plusIconDisable && (
                    <span>
                      <Plus className="" size={15} strokeWidth={4} />
                    </span>
                  )}
                  <span>
                    <Trans i18nKey={`${buttonName}`} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </FormikWrapper>
  );
};

export default AddDharmshalaFloorForm;
