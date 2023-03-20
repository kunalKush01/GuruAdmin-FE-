import { Storage } from "aws-amplify";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../../components/partials/customTextField";
import { addFacility } from "../../redux/authSlice";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";

const WrapFacility = styled.div`
  .addProfile {
    font: normal normal bold 20px/33px Noto Sans;
    color: #583703;
    display: flex;
    align-items: center;
  }

  label {
    /* margin-bottom: 0px; */
    font: normal normal bold 15px/33px Noto Sans;
  }
  input {
    color: #583703 !important;
    border: none !important;
    height: 36px;
    width: 100%;
    padding-top: 9px;
    padding-left: 5px;
    /* text-align: center; */
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 5px;
  }
  input[type="file"]::file-selector-button {
    display: none;
  }
`;

const FacilityForm = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const uploadTemplate = useRef();
  const dispatch = useDispatch();

  const handleSubmit = (trustFacilities) => {
    dispatch(addFacility(trustFacilities));
    history.push("/edit-profile");
  };

  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [files, setFiles] = useState([]);
  const handleUpload = (acceptedFiles) => {
    Storage.put(`temp/${randomNumber}_${acceptedFiles?.name}`, acceptedFiles, {
      contentType: acceptedFiles?.type,
    })
      .then((res) => {
        // props.fileName(acceptedFiles.name,acceptedFiles.type);
        setFiles(
          // acceptedFiles.map((file) =>
          Object.assign(acceptedFiles, {
            preview: URL.createObjectURL(acceptedFiles),
          })
          // )
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <WrapFacility>
      <Formik
        initialValues={{
          name: "",
          description: "",
          facilityImage: "",
          facilityImagePreview: "",
          startTime: "",
          endTime: "",
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <Row>
                <Col>
                  <div className="d-flex align-items-center mb-1">
                    <img
                      src={arrowLeft}
                      className="me-2  cursor-pointer"
                      onClick={() => history.push("/edit-profile")}
                    />
                    <div className="addProfile">
                      <Trans i18nKey={"facilities"} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <CustomTextField
                    label="Facility Name"
                    placeholder="Enter name "
                    name="name"
                  />
                </Col>
                <Col md={6}>
                  <label>Upload Image</label>
                  <div className="d-flex justify-content-between">
                    <input
                      ref={uploadTemplate}
                      type={"file"}
                      // label={t("apna_mandir_upload_background")}
                      name="facilityImage"
                      // placeholder={t("apna_mandir_upload_background_here")}
                      onChange={(e) => {
                        handleUpload(e.target.files[0]);
                        // handleUpload(e.target.files[0]).then((e)=>formik.setFieldValue('templeImage',e.target.files[0].name));
                        formik.setFieldValue(
                          "facilityImage",
                          `${randomNumber}_${e.target.files[0].name}`
                        );
                        formik.setFieldValue(
                          "facilityImagePreview",
                          e.target.files[0]
                        );
                      }}
                    />
                    <Button
                      className="upload_btn"
                      color="primary"
                      onClick={() => uploadTemplate.current.click()}
                    >
                      Browse
                    </Button>
                  </div>
                </Col>
                <Col xs={12}>
                  <CustomTextField
                    label="Facility Description"
                    placeholder="Add Description Here"
                    name="description"
                  />
                </Col>
                <Col md={6}>
                  <Row>
                    <Col sm={6}>
                      <CustomTextField
                        label={"Start Time"}
                        type="time"
                        name="startTime"
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <CustomTextField
                        label={"End Time"}
                        type="time"
                        name="endTime"
                        required
                      />
                    </Col>
                  </Row>
                </Col>
                <div className="mt-5">
                  <Button className="bg_submit" color="primary" type="submit">
                    Add Facility
                  </Button>
                </div>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </WrapFacility>
  );
};

export default FacilityForm;
