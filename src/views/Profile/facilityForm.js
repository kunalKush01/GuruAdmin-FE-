import { Storage } from "aws-amplify";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Col, Form, Row } from "reactstrap";
import styled from "styled-components";
import CustomTextField from "../../components/partials/customTextField";


const WrapFacility = styled.div`
`;


const FacilityForm = () => {
    const history = useHistory()
    const { t } = useTranslation()
  const uploadTemplate = useRef();


  const handleSubmit = (trustFacilities) =>{
    dispatch(addFacility(trustFacilities));
    history(-1);
  };


  const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);

  const [files, setFiles] = useState([]);
  const handleUpload = (acceptedFiles) => {
    Storage.put(`temp/${randomNumber}_${acceptedFiles.name}`, acceptedFiles, {
      contentType: acceptedFiles.type,
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
          startTime: "",
          endTime: "",
        }}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
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
                  {JSON.stringify(formik.values.facilityImage)}
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
                      }}
                    />
                    <Button
                      className="upload_btn"
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
                  <Button className="bg_submit" type="submit">
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
