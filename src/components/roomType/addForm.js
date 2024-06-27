import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
<<<<<<< Updated upstream

// import {
//   findAllCattle,
//   findAllCattleBreed,
//   findAllCattleCategory,
// } from "../../api/cattle/cattleMedical";

=======
>>>>>>> Stashed changes
import CustomTextField from "../partials/customTextField";

const FormikWrapper = styled.div`
  font: normal normal bold 15px/33px Noto Sans;

  .animated-height {
    transition: height 0.5s;
  }
`;

const AddRoomTypeForm = ({
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
        queryClient.invalidateQueries(["roomTypeList"]);
        setLoading(false);
<<<<<<< Updated upstream
        history.push("/roomtype/info");
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        onSubmit={(values) => {
          setLoading(true);
          setShowPrompt(false);
          const { ...formValues } = values;
          const data = {
            ...formValues,
          };
          mutation.mutate(data);
        }}
=======
        onSubmit={handleFormSubmit}
>>>>>>> Stashed changes
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
                      label={t("roomtype_name")}
                      placeholder={t("placeHolder_dharmshala_roomtype_name")}
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
                      label={t("dharmshala_roomtype_description")}
                      placeholder={t(
                        "placeHolder_dharmshala_roomtype_description"
                      )}
                      name="description"
                      required
                      autoFocus
                      onInput={(e) =>
<<<<<<< Updated upstream
                        (e.target.value = e.target.value.slice(0, 30))
=======
                        (e.target.value = e.target.value.slice(0, 256))
>>>>>>> Stashed changes
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_roomtype_capacity")}
                      placeholder={t(
                        "placeHolder_dharmshala_roomtype_capacity"
                      )}
                      name="capacity"
                      required
                      autoFocus
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                    />
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextField
                      label={t("dharmshala_roomtype_price")}
                      placeholder={t("placeHolder_dharmshala_roomtype_price")}
                      name="price"
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

export default AddRoomTypeForm;
