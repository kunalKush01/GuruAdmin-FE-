import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Upload,
} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import "../../assets/scss/common.scss";
import moment from "moment";
import uploadIcon from "../../assets/images/icons/file-upload.svg";

function FamilyModalForm({ isModalVisible, setIsModalVisible,mode }) {
  const { t } = useTranslation();
  const { Option } = Select;

  const relationOptions = [
    "Brother",
    "Sister",
    "Wife",
    "Husband",
    "Father",
    "Mother",
  ];

  const customRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const modalTitle = mode === "add" ? t("member_family_form") : t("edit_family_member");

  return (
    <Modal
      title={modalTitle}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      centered
    >
      <Form layout="vertical">
        <Form.Item
          label={t("member_family_name")}
          name="familyMemberName"
          rules={[
            {
              required: true,
              message: t("required_family_name"),
            },
          ]}
        >
          <Input placeholder={t("placeHolder_family_name")} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label={t("member_dob")} name="dob">
              <DatePicker
                format="YYYY-MM-DD"
                placeholder={t("member_dob")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t("member_anniversary")} name="dateOfAnniversary">
              <DatePicker
                format="YYYY-MM-DD"
                placeholder={t("member_anniversary")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("member_family_relation")}
              name="relation"
              rules={[
                {
                  required: true,
                  message: t("required_family_relation"),
                },
              ]}
            >
              <Select placeholder={t("placeHolder_family_relation")}>
                {relationOptions.map((relation) => (
                  <Option key={relation} value={relation}>
                    {relation}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={t("upload_profile_image")} name="image">
              <Upload
                name="image"
                listType="picture"
                customRequest={customRequest}
                style={{ width: "100%" }}
              >
                <Button
                  icon={
                    <img
                      src={uploadIcon}
                      alt="Upload Icon"
                      style={{ width: 16, height: 16 }}
                    />
                  }
                  style={{ width: "100%" }}
                >
                  {t("upload_profile_image")}
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default FamilyModalForm;
