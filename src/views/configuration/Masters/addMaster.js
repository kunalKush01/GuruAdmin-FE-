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
} from "reactstrap";
import { addMasterInRow } from "../../../api/masterApi";
import Swal from "sweetalert2";
import "../../../assets/scss/common.scss";
import { X } from "react-feather";
const AddMaster = ({
  schema,
  isOpen,
  toggle,
  onSubmit,
  masterId,
  masterItem,
  onSuccess,
}) => {
  const initialFormData = schema.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [validationMessages, setValidationMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputBlur = (field) => {
    if (field.required && !formData[field.name]) {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "Required",
      }));
    } else {
      setValidationMessages((prevMessages) => ({
        ...prevMessages,
        [field.name]: "",
      }));
    }
  };
  const validateForm = () => {
    let valid = true;
    const messages = {};

    schema.forEach((field) => {
      if (field.required && !formData[field.name]) {
        messages[field.name] = "Required";
        valid = false;
      }
    });

    setValidationMessages(messages);
    return valid;
  };
  const handleSubmit = () => {
    if (!validateForm()) {
      console.error("Form validation failed.");
      return;
    }
    const payload = {
      name: masterItem.name,
      key: masterItem.key,
      schema: schema,
      values: { ...formData },
    };

    schema.forEach((field) => {
      const fieldName = field.name;
      if (formData.hasOwnProperty(fieldName)) {
        payload.values[fieldName] = formData[fieldName];
      } else {
        switch (field.type) {
          case "boolean":
            payload.values[fieldName] = false;
            break;
          case "string":
            payload.values[fieldName] = "";
            break;
          case "number":
            payload.values[fieldName] = null;
            break;
          default:
            payload.values[fieldName] = null;
            break;
        }
      }
    });
    addMasterInRow(masterId, payload)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "New row added successfully.",
        });
        onSuccess(true);
        setFormData(initialFormData);
        toggle();
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
    <Modal isOpen={isOpen} toggle={toggle} centered id="addMasterForm">
      <ModalHeader  toggle={toggle}>Add New Entry<div><X className="cancleIcon" onClick={toggle} size={15} strokeWidth={4} style={{marginRight:"5px"}} /></div></ModalHeader>
      <ModalBody>
        <Form className="row">
          {schema.map((field) => (
            <FormGroup key={field.name} className="col-md-6">
              <Label
                for={field.name}
                style={{ fontSize: "13px", fontWeight: "500" }}
              >
                {field.name}
                {field.required && <span className="text-danger">*</span>}
              </Label>
              <Input
                type={
                  field.type === "string"
                    ? "text"
                    : field.type == "boolean"
                    ? "select"
                    : "number"
                }
                style={{
                    border:validationMessages[field.name]?"1px solid #ff8744":""
                }}
                placeholder={
                  field.type == "boolean" || field.type == "string" ? "" : "123"
                }
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                onBlur={() => handleInputBlur(field)}
              >
                <option value="">{t('select_option')}</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </Input>
              {validationMessages[field.name] && (
                <div  style={{color:"#ff8744", fontSize: "12px" }}>
                  {validationMessages[field.name]}
                </div>
              )}
            </FormGroup>
          ))}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button id="submit" onClick={handleSubmit}>
          Submit
        </Button>{" "}
        <Button
          id="cancel"
          onClick={() => {
            toggle()
            setValidationMessages({});
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddMaster;
