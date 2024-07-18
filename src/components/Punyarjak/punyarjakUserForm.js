import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import CustomTextField from "../partials/customTextField";
import FormikCustomDatePicker from "../partials/formikCustomDatePicker";
import ImageUpload from "../partials/imageUpload";
import RichTextField from "../partials/richTextEditorField";
import '../../../src/styles/common.scss';

const FormWrapper = styled.div``;
;

export default function PunyarjakForm({
  plusIconDisable = false,
  loadOptions,
  handleSubmit,
  validationSchema,
  editThumbnail,
  AddLanguage,
  thumbnailImageName,
  langSelectionValue,
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
        punyarjakQueryClient.invalidateQueries(["punyarjakDetails"]);
        setLoading(false);
        history.push("/punyarjak");
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });
  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
  const [showPrompt, setShowPrompt] = useState(true);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [imageName, setImageName] = useState(thumbnailImageName);

  const langToast = {
    toastId: "langError",
  };
  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          if (langSelectionValue === "Select") {
            toast.error("Please select a language", { ...langToast });
            return;
          }
          setShowPrompt(false);
          setLoading(true);
          punyarjakMutation.mutate({
            punyarjakId: e?.id,
            image: editThumbnail ? imageName : e?.image,
            title: e?.title,
            description: e?.description,
            publishDate: e.DateTime,
          });
        }}
        validationSchema={validationSchema}
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
              <Col xs={12} lg={7}>
                <Row>
                  <Col xs={12} md={6}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      placeholder={t("placeHolder_title")}
                      name="title"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 256))
                      }
                      autoFocus
                    />
                  </Col>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="description"
                    />
                  </Col>
                </Row>
                {!AddLanguage && (
                  <Row>
                    <Col xs={12}>
                      <div className="ImagesVideos">
                        <Trans i18nKey={"add_image"} />{" "}
                        <span style={{ fontSize: "13px", color: "gray" }}>
                          <Trans i18nKey={"image_size_suggestion"} />
                        </span>
                      </div>
                      <ImageUpload
                        bg_plus={thumbnailImage}
                        imageSpinner={imageSpinner}
                        acceptFile="image/*"
                        imageName="PunyarjakImage"
                        svgNotSupported
                        setImageSpinner={setImageSpinner}
                        editTrue="edit"
                        disabledAddLanguage={AddLanguage}
                        editedFileNameInitialValue={
                          formik?.values?.image ? formik?.values?.image : null
                        }
                        randomNumber={randomNumber}
                        fileName={(file, type) => {
                          formik.setFieldValue("image", `${file}`);
                          formik.setFieldValue("type", type);
                          setImageName(`${file}`);
                        }}
                        removeFile={(fileName) => {
                          formik.setFieldValue("image", "");
                          setImageName("");
                        }}
                      />
                      <div
                        style={{
                          height: "20px",
                          width: "fit-content",
                          textAlign: "left",
                          font: "normal normal bold 11px/15px Noto Sans",
                        }}
                      >
                        {formik.errors.image && formik.touched.image && (
                          <div className="text-danger text-center">
                            <Trans i18nKey={formik.errors.image} />
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col xs={12} lg={4}>
                {!AddLanguage && (
                  <Col>
                    <FormikCustomDatePicker
                      label={t("donation_select_date")}
                      name="DateTime"
                      pastDateNotAllowed
                      // showTimeInput={showTimeInput}
                    />
                  </Col>
                )}
              </Col>
            </Row>

            {/* <Row className="paddingForm">
              <Col xs={12} md={10} className=" mt-2 ps-0 d-flex">
                <Row className="w-100">
                  <Col xs={12} md={6}>
                    <CustomTextField
                      label={t("news_label_Title")}
                      placeholder={t("placeHolder_title")}
                      name="title"
                      required
                      onInput={(e) =>
                        (e.target.value = e.target.value.slice(0, 30))
                      }
                      autoFocus
                    />
                  </Col>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="description"
                    />
                  </Col>
                </Row>
              </Col>
            </Row> */}
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
                  disabled={imageSpinner}
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
    </div>
  );
}
