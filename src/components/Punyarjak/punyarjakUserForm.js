import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
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
import "../../assets/scss/common.scss";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { DatePicker, Image } from "antd";
import moment from "moment";
import UploadImage from "../partials/uploadImage";
import { uploadFile } from "../../api/sharedStorageApi";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import { fetchImage } from "../partials/downloadUploadImage";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
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
  const [uploadedFileUrl, setUploadedFileUrl] = useState(thumbnailImageName);
  const [imageUrl, setImageUrl] = useState(null);

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
    <div
      className="formwrapper FormikWrapper"
      style={{ position: "absolute", zIndex: "-10000" }}
    >
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
            image: uploadedFileUrl || "",
            title: e?.title,
            description: e?.description,
            publishDate: e.DateTime,
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values.image) {
              const loadImage = async () => {
                const url = await fetchImage(formik.values.image);
                if (url) {
                  setImageUrl(url);
                }
              };
              loadImage();
            }
          }, [formik.values.image]);
          return (
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
                <Row>
                  <Col xs={12} lg={9} md={6}>
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
                  <Col xs={12} lg={3} md={6}>
                    {!AddLanguage && (
                      <Col>
                        <label>{t("donation_select_date")}</label>
                        <CustomDatePickerComponent
                          placeholder={t("donation_select_date")}
                          style={{ width: "100%" }}
                          name="DateTime"
                          format="DD MMM YYYY"
                          onChange={(date) => {
                            if (date) {
                              const utcDate = date
                                .startOf("day")
                                .utc()
                                .toISOString();
                              formik.setFieldValue("DateTime", utcDate);
                            } else {
                              formik.setFieldValue("DateTime", "");
                            }
                          }}
                          value={
                            formik.values["DateTime"]
                              ? moment.utc(formik.values["DateTime"])
                              : null
                          }
                          disabledDate={(current) =>
                            current < moment().startOf("day")
                          }
                        />
                      </Col>
                    )}
                  </Col>
                  <Col xs={12} className="mt-lg-1">
                    <RichTextField
                      height="200px"
                      label={t("news_label_Description")}
                      name="description"
                    />
                  </Col>
                  <Col xs={12} lg={4} md={6}>
                    <div className="ImagesVideos">
                      <Trans i18nKey={"add_image"} />{" "}
                      <span style={{ fontSize: "13px", color: "gray" }}>
                        <Trans i18nKey={"image_size_suggestion"} />
                      </span>
                    </div>
                    <UploadImage
                      required
                      uploadFileFunction={uploadFile}
                      setUploadedFileUrl={setUploadedFileUrl}
                      name="PunyarjakImage"
                      listType="picture"
                      maxCount={1}
                      buttonLabel={t("upload_image")}
                      initialUploadUrl={imageUrl}
                      icon={
                        <img
                          src={uploadIcon}
                          alt="Upload Icon"
                          style={{ width: 16, height: 16 }}
                        />
                      }
                    />
                  </Col>
                </Row>
              </Row>
              <div className="btn-Published  mt-lg-3">
                {loading ? (
                  <Button color="primary" className="add-trust-btn" disabled>
                    <Spinner size="md" />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="addAction-btn "
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
          );
        }}
      </Formik>
    </div>
  );
}
