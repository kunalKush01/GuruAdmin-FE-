import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import { Plus, X } from "react-feather";
import { createMaster } from "../../../api/masterApi";
import deleteIcon from "../../../../src//assets/images/icons/category/deleteIcon.svg";

const AddMasterForm = ({ isOpen, toggle, onSuccess }) => {
  const [formData, setFormData] = useState({
    MasterName: "",
    Key: "",
    fields: [{ FieldName: "", FieldType: "", Required: false }],
  });
  const [validationMessages, setValidationMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...formData.fields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleCheckboxChange = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields[index].Required = !updatedFields[index].Required;
    setFormData({ ...formData, fields: updatedFields });
  };
  const handleInputBlur = (field) => {
    if (!formData[field]) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field]: "Required",
      }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const messages = {};
    if (!formData.MasterName) {
      messages.MasterName = "Required";
      valid = false;
    }
    if (!formData.Key) {
      messages.Key = "Required";
      valid = false;
    }
    formData.fields.forEach((field, index) => {
      if (!field.FieldName) {
        messages[`FieldName-${index}`] = "Required";
        valid = false;
      }
      if (!field.FieldType) {
        messages[`FieldType-${index}`] = "Required";
        valid = false;
      }
    });

    setValidationMessages(messages);
    return valid;
  };
  const handleAddField = () => {
    setFormData((prevData) => ({
      ...prevData,
      fields: [
        ...prevData.fields,
        { FieldName: "", FieldType: "", Required: false },
      ],
    }));
  };
  const handleRemoveField = (index) => {
    if (index !== 0) {
      const updatedFields = formData.fields.filter((_, i) => i !== index);
      setFormData({ ...formData, fields: updatedFields });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      console.error("Form validation failed.");
      return;
    }

    const payload = {
      name: formData.MasterName,
      key: formData.Key,
      schema: formData.fields.map((field) => ({
        name: field.FieldName,
        type: field.FieldType,
        required: field.Required,
      })),
    };
    createMaster(payload)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "New row added successfully.",
        });
        onSuccess(true);
        setFormData({
          MasterName: "",
          Key: "",
          fields: [{ FieldName: "", FieldType: "", Required: false }],
        });
        toggle();
        if(res.error){
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Both name and key must be unique. The provided name or key already exists.",
          });
          onSuccess(false);
        }
      })
      .catch((error) => {
        onSuccess(false);
        console.error("Error adding new row:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add new row.",
        });
      });
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>
        Add New Master
        <div>
          <X
            className="cancleIcon"
            onClick={toggle}
            size={15}
            strokeWidth={4}
            style={{ marginRight: "5px" }}
          />
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col xs={12} sm={6} lg={6}>
              <FormGroup>
                <Label
                  for="MasterName"
                  style={{ fontSize: "13px", fontWeight: "500" }}
                >
                  Master Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="MasterName"
                  id="MasterName"
                  value={formData.MasterName}
                  onChange={handleChange}
                  onBlur={() => handleInputBlur("MasterName")}
                  style={{
                    border: validationMessages.MasterName
                      ? "1px solid #ff8744"
                      : "",
                  }}
                />
                {validationMessages.MasterName && (
                  <div style={{ color: "#ff8744", fontSize: "12px" }}>
                    {validationMessages.MasterName}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <FormGroup>
                <Label
                  for="Key"
                  style={{ fontSize: "13px", fontWeight: "500" }}
                >
                  Key <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="Key"
                  id="Key"
                  value={formData.Key}
                  onChange={handleChange}
                  onBlur={() => handleInputBlur("Key")}
                  style={{
                    border: validationMessages.Key ? "1px solid #ff8744" : "",
                  }}
                />
                {validationMessages.Key && (
                  <div style={{ color: "#ff8744", fontSize: "12px" }}>
                    {validationMessages.Key}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          {formData.fields.map((field, index) => (
            <>
              <Row key={index}>
                <Col xs={12} sm={4} lg={4}>
                  <FormGroup>
                    <Label
                      for={`FieldName-${index}`}
                      style={{ fontSize: "13px", fontWeight: "500" }}
                    >
                      Field Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="FieldName"
                      id={`FieldName-${index}`}
                      value={field.FieldName}
                      onChange={(e) => handleFieldChange(index, e)}
                      onBlur={() => handleInputBlur(`FieldName-${index}`)}
                      style={{
                        border: validationMessages[`FieldName-${index}`]
                          ? "1px solid #ff8744"
                          : "",
                      }}
                    />
                    {validationMessages[`FieldName-${index}`] && (
                      <div style={{ color: "#ff8744", fontSize: "12px" }}>
                        {validationMessages[`FieldName-${index}`]}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col xs={12} sm={4} lg={4}>
                  <FormGroup>
                    <Label
                      for={`FieldType-${index}`}
                      style={{ fontSize: "13px", fontWeight: "500" }}
                    >
                      Field Type <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="select"
                      name="FieldType"
                      id={`FieldType-${index}`}
                      value={field.FieldType}
                      onChange={(e) => handleFieldChange(index, e)}
                      onBlur={() => handleInputBlur(`FieldType-${index}`)}
                      style={{
                        border: validationMessages[`FieldType-${index}`]
                          ? "1px solid #ff8744"
                          : "",
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="other">Other</option>
                    </Input>
                    {validationMessages[`FieldType-${index}`] && (
                      <div style={{ color: "#ff8744", fontSize: "12px" }}>
                        {validationMessages[`FieldType-${index}`]}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col xs={12} sm={index !== 0 ? 3 : 4} lg={index !== 0 ? 3 : 4}>
                  <FormGroup check style={{ marginTop: "31px" }}>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={field.Required}
                        onChange={() => handleCheckboxChange(index)}
                      />{" "}
                      Required
                    </Label>
                  </FormGroup>
                </Col>
                {index !== 0 && (
                  <Col
                    xs={12}
                    sm={1}
                    lg={1}
                    style={{
                      display: "flex",
                      alignItems: " center",
                      justifyContent: " center",
                      marginBottom: " 23px",
                    }}
                  >
                    <img
                      src={deleteIcon}
                      onClick={() => handleRemoveField(index)}
                      style={{
                        cursor: "pointer",
                        width: "35px",
                        height: "35px",
                      }}
                    />
                  </Col>
                )}
              </Row>
            </>
          ))}
          <Button color="primary" onClick={handleAddField}>
            Add Another Field
          </Button>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button id="submit" onClick={handleSubmit}>
          Submit
        </Button>{" "}
        <Button
          id="cancel"
          onClick={() => {
            toggle();
            setValidationMessages({});
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddMasterForm;
