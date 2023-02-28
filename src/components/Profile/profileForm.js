import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import { Plus } from "react-feather";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";
import styled from "styled-components";
import { CustomReactSelect } from "../partials/customReactSelect";
import CustomTextField from "../partials/customTextField";
import defalultAvtar from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import thumbnailImage from "../../assets/images/icons/Thumbnail.svg";
import { useSelector } from "react-redux";
import { useState } from "react";

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
  .trust-facilities {
    border: 1px solid;
    border-radius: 6px;
  }
`;

export default function ProfileForm({
  handleSubmit,
  vailidationSchema,
  buttonLabel,
  initialValues,
  showTimeInput,
  selectEventDisabled,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading]= useState(false)
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
      if(!data.error){
        queryClient.invalidateQueries(["Trust"]);
        setLoading(false);
      }
      else if (data?.error){
        setLoading(false)
      }
    },
  });

  const OptionData = [
    {
      value: "gaushala",
      name: "Gaushala",
    },
    {
      value: "temple",
      name: "Temple",
    },
    {
      value: "trust",
      name: "Trust",
    },
  ];

  return (
    <ProfileFormWaraper className="FormikWraper">
      <Formik
        // enableReinitialize
        initialValues={initialValues}
        onSubmit={(e) => {
          setLoading(true)
          console.log("Trust Add=", e);
          mutation.mutate({
            name: e?.name,
            email: e?.EmailId,
            type: e?.Type,
            contact: e?.Contact,
            address: e?.Address,
            temple: e?.Temple,
            documents: e?.documents,
            body: e?.Body,
          });
        }}
        validationSchema={vailidationSchema}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col xs={2} className="">
                <div className="d-flex justify-content-center">
                  <img src={defalultAvtar} width={120} />
                </div>
              </Col>
              <Col xs={10} className="">
                <Row>
                  <Col xs={8} className="">
                    <Row>
                      <Col xs={6} className="">
                        <CustomTextField
                          label={t("userProfile_name")}
                          name="name"
                          autoFocus
                        />
                      </Col>
                      <Col xs={6} className="">
                        <CustomTextField
                          label={t("userProfile_email_id")}
                          name="EmailId"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} className="">
                        <CustomTextField
                          label={t("userProfile_phone_number")}
                          name="Contact"
                        />
                      </Col>
                      <Col xs={6} className="">
                        <CustomTextField
                          label={t("subscribed_user_address")}
                          name="Address"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} className="">
                        <CustomTextField
                          label={t("userProfile_temple")}
                          name="Temple"
                        />
                      </Col>
                      <Col xs={6} className="">
                        <CustomReactSelect
                          labelName={t("userProfile_trust_type")}
                          name="Type"
                          // loadOptions={masterloadOptionQuery?.data?.results ?? []}
                          labelKey={"name"}
                          options={OptionData}
                          width={"auto"}
                          // valueKey={"id"}
                          // placeholder={t("userProfile_trust_type")}
                          // onChange={(data) => setSelectedMasterCate(data?.id ?? "")}
                        />
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
                  </Col>
                  <Col xs={4}>
                    <Row>
                      <Col xs={12} className="">
                        <div>
                          <Trans i18nKey={"images"} />
                        </div>
                        <Row>
                          <Col xs={5} className="bg-secondary imagesBox">
                            a
                          </Col>
                          <Col xs={5} className="bg-secondary imagesBox">
                            a
                          </Col>
                          <Col xs={5} className="bg-secondary imagesBox">
                            a
                          </Col>
                          <Col xs={5} className="bg-secondary imagesBox">
                            a
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  {/* <Col xs={6}>
                    <AsyncSelectField
                      name="SelectedEvent"
                      loadOptions={loadOption}
                      labelKey={"title"}
                      valueKey={"id"}
                      label={t("trust_trustType")}
                      placeholder={t("Notice_select_dropDown")}
                      disabled={selectEventDisabled}
                    />
                  </Col> */}
                  <Row className="">
                    <Col xs={3} className="">
                      <div className="ImagesVideos">
                        <Trans i18nKey={"userProfile_facilities"} />
                      </div>
                      <div>
                        <div className="trust-facilities d-flex align-items-center">
                          <img
                            src={thumbnailImage}
                            width={70}
                            height={70}
                            className="cursor-pointer"
                          />
                          <div className="ms-2" style={{ fontSize: "15px" }}>
                            Add More Facilities
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={9} className="">
                      <div className="ImagesVideos">
                        <Trans i18nKey={"userProfile_punyarjak"} />
                      </div>
                    </Col>
                  </Row>
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
