import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import ImageUpload from "../partials/imageUpload";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import RichTextField from "../partials/richTextEditorField";
import { Prompt } from "react-router-dom";

const FormWaraper = styled.div`
  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 8px 20px;
    margin-left: 10px;
    font: normal normal bold 15px/20px noto sans;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .filterPeriod {
    color: #ff8744;

    font: normal normal bold 13px/5px noto sans;
  }
`;

export default function PunyarjakForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  vailidationSchema,
  profileImageName,
  editProfile,
  initialValues,
  showTimeInput,
  addDonationUser,
  buttonName = "",
  ...props
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const currentPage = searchParams.get("page");
  const currentCategory = searchParams.get("category");
  const currentSubCategory = searchParams.get("subCategory");
  const currentFilter = searchParams.get("filter");
  const punyarjakQueryClient = useQueryClient();

  const punyarjakMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        punyarjakQueryClient.invalidateQueries(["punyarjak"]);
        setLoading(false);
        history.push("/punyarjak");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <FormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setShowPrompt(false)
          setLoading(true);
          punyarjakMutation.mutate({
            punyarjakId: e?.id,
            profilePhoto: editProfile ? profileImageName : e?.file,
            name: e?.name,
            description: e?.description,
          });
        }}
        validationSchema={vailidationSchema}
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
            {/* <Row>
              <Col xs={12}>
                <Row>
                  <Col>
                    <CustomTextField
                      label={t("user_name")}
                      name="name"
                      autoFocus
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("dashboard_Recent_DonorNumber")}
                      name="mobile"
                      type="number"
                      pattern="[6789][0-9]{9}"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 12))
                      }
                    />
                  </Col>
                  <Col>
                    <CustomTextField
                      label={t("subscribed_user_email")}
                      name="email"
                    />
                  </Col>
                </Row>
              </Col>
            </Row> */}

            <Row>
              <Col xs={12} className=" mt-2 ps-0 d-flex flex-wrap">
                <div className="me-3">
                  <ImageUpload
                    bg_plus={defaultAvtar}
                    profileImage
                    editTrue="edit"
                    editedFileNameInitialValue={
                      formik.values.file ? formik.values.file : null
                    }
                    randomNumber={randomNumber}
                    fileName={(file, type) => {
                      formik.setFieldValue("file", `${randomNumber}_${file}`);
                      formik.setFieldValue("type", type);
                      profileImageName = `${randomNumber}_${file}`;
                    }}
                    removeFile={(fileName) => {
                      formik.setFieldValue("file", "");
                      profileImageName = "";
                    }}
                  />
                  <div
                    style={{
                      height: "20px",
                      font: "normal normal bold 11px/15px Noto Sans",
                    }}
                  >
                    {formik.errors.file &&
                      formik.touched.file && (
                        <div className="text-danger text-center">
                          <Trans i18nKey={formik.errors.file} />
                        </div>
                      )}
                  </div>
                </div>
                <Row>
                  <Col xs={12}>
                    <CustomTextField
                      label={t("name")}
                      name="name"
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      autoFocus
                    />
                  </Col>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="100px"
                      label={t("news_label_Description")}
                      name="description"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published  mt-lg-3">
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
                  className="addNotice-btn "
                  type="submit"
                >
                  {plusIconDisable && (
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
    </FormWaraper>
  );
}
