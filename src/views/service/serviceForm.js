import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import CustomTextField from "../../components/partials/customTextField";
import ImageUpload from "../../components/partials/imageUpload";
import RichTextField from "../../components/partials/richTextEditorField";
import "../../assets/scss/common.scss";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { DatePicker, Image } from "antd";
import UploadImage from "../../components/partials/uploadImage";
import { uploadFile } from "../../api/sharedStorageApi";
import uploadIcon from "../../assets/images/icons/file-upload.svg";
import { fetchImage } from "../../components/partials/downloadUploadImage";
import FormikCustomReactSelect from "../../components/partials/formikCustomReactSelect";
import moment from "moment";
const CustomDatePickerComponent =
  DatePicker.generatePicker(momentGenerateConfig);
export default function ServiceForm({
  buttonName = "",
  plusIconDisable = false,
  handleSubmit,
  editImage,
  defaultImages,
  validationSchema,
  initialValues,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const serviceQueryClient = useQueryClient();
  const selectedLang = useSelector((state) => state.auth.selectLang);
  const serviceMutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        serviceQueryClient.invalidateQueries(["services"]);
        setLoading(false);
        history.push("/service");
      } else if (data.error) {
        setLoading(false);
      }
    },
  });
  
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  return (
    <div className="formwrapper FormikWrapper">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          //   setShowPrompt(false);
          setLoading(true);
          serviceMutation.mutate({
            name: e.name,
            description: e.description,
            frequency: e.frequency?.value,
            dates: e.dates,
            amount: e.amount,
            countPerDay: e.countPerDay,
            images: [uploadedFileUrl] || [],
          });
        }}
        validationSchema={validationSchema}
      >
        {(formik) => {
          useEffect(() => {
            if (formik.values.images && formik.values.images.length > 0) {
              const loadImages = async () => {
                const urls = await Promise.all(
                  formik.values.images.map(async (image) => {
                    const url = await fetchImage(image.name);
                    return url;
                  })
                );

                setImageUrl(urls);
              };

              loadImages();
            }
          }, [formik.values.images]);
          return (
            <Form>
              <Row className="paddingForm">
                <Row>
                  <Col xs={12} lg={8} md={8}>
                    <CustomTextField
                      label={t("name")}
                      placeholder={t("name")}
                      name="name"
                    />
                  </Col>
                  <Col xs={12} lg={4} md={4}>
                    <CustomTextField
                      label={t("count_per_day")}
                      placeholder={t("count_per_day")}
                      name="countPerDay"
                      type="number"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} lg={4} md={4}>
                    <FormikCustomReactSelect
                      labelName={t("frequency")}
                      name="frequency"
                      loadOptions={[
                        { value: "Daily", label: "Daily" },
                        { value: "Weekly", label: "Weekly" },
                        { value: "Monthly", label: "Monthly" },
                        { value: "Yearly", label: "Yearly" },
                      ]}
                      required
                      width
                      placeholder={t("frequency")}
                    />
                  </Col>
                  <Col xs={12} lg={4} md={4}>
                    <label>{t("date")}</label>
                    <CustomDatePickerComponent
                      multiple
                      id="datePickerANTD"
                      className="serviceMultipleDatepicker"
                      format="DD MMM YYYY"
                      onChange={(dates) => {
                        if (dates && dates.length > 0) {
                          // Map the selected dates to a formatted array
                          const formattedDates = dates.map((date) =>
                            date.format("DD MMM YYYY")
                          );
                          formik.setFieldValue("dates", formattedDates);
                        } else {
                          formik.setFieldValue("dates", []);
                        }
                      }}
                      value={
                        Array.isArray(formik.values.dates) &&
                        formik.values.dates.length > 0
                          ? formik.values.dates.map((date) =>
                              moment(date)
                            )
                          : []
                      }
                    />
                  </Col>
                  <Col xs={12} lg={4} md={4}>
                    <CustomTextField
                      label={t("amount")}
                      placeholder={t("amount")}
                      name="amount"
                      type="number"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="">
                    <RichTextField
                      height="200px"
                      label={t("description")}
                      name="description"
                    />
                  </Col>

                  <Col xs={12} lg={6} md={6}>
                    <div className="ImagesVideos">
                      <Trans i18nKey={"news_label_ImageVedio"} />{" "}
                      <span style={{ fontSize: "13px", color: "gray" }}>
                        <Trans i18nKey={"image_size_suggestion"} />
                      </span>
                    </div>
                    <div>
                      <UploadImage
                        required
                        uploadFileFunction={uploadFile}
                        setUploadedFileUrl={setUploadedFileUrl}
                        name="images"
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
                    </div>
                  </Col>
                </Row>
              </Row>
              <div className="btn-Published mb-2">
                {loading ? (
                  <Button color="primary" className="add-trust-btn" disabled>
                    <Spinner size="md" />
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="addAction-btn "
                    type="submit"
                    // disabled={!loading}
                  >
                    {plusIconDisable && (
                      <span>
                        <Plus className="me-1" size={15} strokeWidth={4} />
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
