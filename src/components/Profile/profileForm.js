import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { CustomReactSelect } from "../partials/customReactSelect";
import CustomTextField from "../partials/customTextField";
import defaultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import { useSelector } from "react-redux";
import ImageUpload from "../partials/imageUpload";
import { useState } from "react";
import FormikCustomReactSelect from "../partials/formikCustomReactSelect";
import { getAllTrustType } from "../../api/profileApi";

const ProfileFormWaraper = styled.div`
  .existlabel {
    margin-bottom: 10px;
    font: normal normal bold 15px/33px Noto Sans;
  }
  .FormikWraper {
    padding: 40px;
  }
  .Upload-btn {
    padding: 8px 32px;
    font: normal normal bold 15px/20px noto sans;
  }
  .thumbnail_image {
    cursor: pointer;
  }
  .imagesBox {
    margin: 10px;
  }
  .filterPeriod {
    color: #ff8744;
    font: normal normal bold 13px/5px noto sans;
  }
  .facility_button {
    width: 90%;
    /* height: 170px; */
    border: 1px solid #583703;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    padding: 2rem 2rem;
  }
  .facility_button svg {
    width: 100px;
    height: 100px;
    /* color: #583703; */
  }
  .facility_add {
    font: normal normal 800 13px/45px Noto Sans;
    /* color: #583703; */
    text-decoration: none;
  }
`;

export default function ProfileForm({
  handleSubmit,
  vailidationSchema,
  buttonLabel,
  editImage,
  defaultImages,
  initialValues,
  editProfile,
  profileImageName,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  // const QueryClient = useQueryClient();

  // const Mutation = useMutation({
  //   mutationFn: handleSubmit,
  //   onSuccess: (data) => {
  //     if (!data.error) {
  //       QueryClient.invalidateQueries(["Notices"]);
  //       QueryClient.invalidateQueries(["NoticeDetail"]);
  //       history.push("/notices");
  //     }
  //   },
  // });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Trust"]);
        setLoading(false);
      } else if (data?.error) {
        setLoading(false);
      }
    },
  });

  const selectedLang = useSelector((state) => state.auth.selectLang);

  const allTrustTypes = useQuery(
    ["trustTypes", selectedLang.id],
    async () =>
      await getAllTrustType({
        languageId: selectedLang.id,
      })
  );

  console.log("allTrustTypes", allTrustTypes?.data?.results);
  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [deletedImages, setDeletedImages] = useState([]);
  
  const facilityData = useSelector(
    (state) => state?.trustRegister?.trustFacilities
  );
  return (
    <ProfileFormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setLoading(true);
          console.log("Trust Add=", e);
          mutation.mutate({
            name: e?.name,
            email: e?.EmailId,
            type: e?.Type,
            contact: e?.Contact,
            address: e?.Address,
            temple: e?.Temple,
            documents: e?.documents,
            typeId: e?.trustType?.id,
            body: e?.Body,
            images: e?.images,
            profilePhoto:editProfile ? profileImageName : e?.file,
            removedImages: deletedImages,
            trustFacilities: facilityData,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={2} className="">
                <div className="d-flex justify-content-center">
                <ImageUpload
                    bg_plus={defaultAvtar}
                    profileImage
                    editTrue="edit"
                    editedFileNameInitialValue={
                      formik.values.profileImage ? formik.values.profileImage : null
                    }
                    randomNumber={randomNumber}
                    fileName={(file, type) => {
                      formik.setFieldValue("profileImage", `${randomNumber}_${file}`);
                      formik.setFieldValue("type", type);
                      profileImageName = `${randomNumber}_${file}`;
                    }}
                    removeFile={(fileName) => {
                      formik.setFieldValue("profileImage", "");
                      profileImageName = "";
                    }}
                  />
                </div>
              </Col>
              <Col xs={10} className="">
                <Row>
                  <Col xs={6} lg={4} className="">
                    <CustomTextField
                      label={t("userProfile_name")}
                      name="name"
                      autoFocus
                    />
                  </Col>
                  <Col xs={6} lg={4} className="">
                    <CustomTextField
                      label={t("userProfile_email_id")}
                      name="EmailId"
                    />
                  </Col>
                  <Col xs={6} lg={4} className="">
                    <CustomTextField
                      label={t("userProfile_phone_number")}
                      name="Contact"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} lg={4} className="">
                    <CustomTextField
                      label={t("subscribed_user_address")}
                      name="Address"
                    />
                  </Col>
                  <Col xs={6} lg={4} className="">
                    <CustomTextField
                      label={t("userProfile_temple")}
                      name="Temple"
                    />
                  </Col>
                  <Col xs={6} lg={4} className="">
                    <FormikCustomReactSelect
                      labelName={t("trust_trustType")}
                      name={"trustType"}
                      labelKey={"name"}
                      valueKey="id"
                      loadOptions={allTrustTypes?.data?.results}
                      defaultValue={formik?.values?.trustType}
                      width={"100"}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="existlabel">
                      <Trans i18nKey={"images"} />
                    </div>
                    <div>
                      <ImageUpload
                        multiple
                        type={editImage}
                        bg_plus={thumbnailImage}
                        setDeletedImages={setDeletedImages}
                        editedFileNameInitialValue={
                          formik?.values?.images ? formik?.values?.images : null
                        }
                        defaultImages={defaultImages}
                        randomNumber={randomNumber}
                        fileName={(file, type) => {
                          formik.setFieldValue("images", [
                            ...formik?.values?.images,
                            `${randomNumber}_${file}`,
                          ]);
                          formik.setFieldValue("type", type);
                        }}
                        removeFile={(fileName) => {
                          const newFiles = [...formik.values.images];
                          // newFiles.splice(index, 1);
                          const updatedFiles = newFiles.filter(
                            (img) => !img.includes(fileName)
                          );
                          formik.setFieldValue("images", updatedFiles);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Row className="d-flex align-items-center">
                      <Col xs={10} className="pe-0">
                        <CustomTextField
                          label={t("userProfile_doc_certificate")}
                          placeholder={t("userProfile_temple_upload_doc")}
                          name="documents"
                        />
                      </Col>
                      <Col xs={2} className="pt-1">
                        <Button color="primary" className="Upload-btn">
                          <span>
                            <Trans i18nKey={"browse"} />
                          </span>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <div className="existlabel  ">
                      <Trans i18nKey={"userProfile_facilities"}/>
                    </div>
                  </Col>
                  {formik?.values?.trustFacilities?.map((item, idx) => {
                    return (
                      <Col lg={3} md={4} sm={6} key={idx}>
                        <div className="">
                          <div className="trust_img">
                            <img src={item?.file} alt="" />
                          </div>
                          <div className="py-1">
                            <div className="temple_name">{item?.name}</div>
                            <div className="temple_time">
                              Timings : {item?.startTime} to {item?.endTime}
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                  <Col lg={3} md={4} sm={6}>
                    <div
                      className=""
                      onClick={() => {
                        history.push("/facilities")
                        // dispatch(handleRegister(formik.values));
                      }}
                    >
                      <div>
                        <div className="facility_button">
                          <Plus />
                        </div>
                        <div className="facility_add">
                          + Add More Facilities
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="btn-Published d-flex justify-content-center mt-3">
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
                <Button color="primary" className="addEvent-btn" type="submit">
                  <span>
                    <Trans i18nKey={buttonLabel} />
                  </span>
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </ProfileFormWaraper>
  );
}
