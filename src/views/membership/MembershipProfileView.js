import React, { useState } from "react";
import { Row, Col, Card, Switch, Tabs } from "antd";
import profileImg from "../../assets/images/icons/pngtree.png";
import familyImg1 from "../../assets/images/avatars/5.png";
import familyImg2 from "../../assets/images/avatars/12.png";
import familyImg3 from "../../assets/images/avatars/8.png";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import personIcon from "../../assets/images/icons/membership/person.svg";
import businessIcon from "../../assets/images/icons/membership/clipboard.svg";
import calenderIcon from "../../assets/images/icons/membership/date.svg";
import ringIcon from "../../assets/images/icons/membership/ring.svg";
import phoneIcon from "../../assets/images/icons/membership/phone.svg";
import whatsappIcon from "../../assets/images/icons/membership/whatsapp.svg";
import mailIcon from "../../assets/images/icons/membership/mail.svg";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import editIcon from "../../assets/images/icons/category/editIcon.svg";
import arrowLeft from "../../assets/images/icons/arrow-left.svg";
import { useHistory } from "react-router-dom";
import FamilyModalForm from "./FamilyModalForm";

function MembershipProfileView() {
  const { t } = useTranslation();
  const history = useHistory();
  const [toggleSwitch, setToggleSwitch] = useState(false);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const handleToggle = (checked) => {
    setToggleSwitch(checked);
  };
  const [activeTab, setActiveTab] = useState("family");
  //** Add Family Modal Handle */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalVisible(true);
  };

  const items = [
    {
      key: "family",
      label: t("family"),
      children: (
        <div>
          <Card className="familyCard">
            <div>
              <div className="familyDetails d-flex flex-row">
                <div className="famRow1">
                  <div className="me-1">
                    <img
                      src={familyImg2}
                      className="familyProfile"
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="famRow2">
                  <div className="me-3">
                    <span className="memberAdd">Name</span>
                    <p className="memberInfo mb-0">Ritwik Jain</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Relation</span>
                    <p className="memberInfo mb-0">Brother</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Birth</span>
                    <p className="memberInfo mb-0">22 Jan 1985</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Anniversary</span>
                    <p className="memberInfo mb-0">22 Aug 2023</p>
                  </div>
                </div>
                <div className="famRow3">
                  <Button
                    className="editmember"
                    onClick={() => openModal("edit")}
                  >
                    Edit
                  </Button>
                  <img src={editIcon} width={35} className="editIconMember" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="familyCard">
            <div>
              <div className="familyDetails d-flex flex-row">
                <div className="famRow1">
                  <div className="me-1">
                    <img
                      src={familyImg1}
                      className="familyProfile"
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="famRow2">
                  <div className="me-3">
                    <span className="memberAdd">Name</span>
                    <p className="memberInfo mb-0">Radha Jain</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Relation</span>
                    <p className="memberInfo mb-0">Wife</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Birth</span>
                    <p className="memberInfo mb-0">-</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Anniversary</span>
                    <p className="memberInfo mb-0">-</p>
                  </div>
                </div>
                <div className="famRow3">
                  <Button className="editmember">Edit</Button>
                  <img src={editIcon} width={35} className="editIconMember" />
                </div>
              </div>
            </div>
          </Card>
          <Card className="familyCard">
            <div>
              <div className="familyDetails d-flex flex-row">
                <div className="famRow1">
                  <div className="me-1">
                    <img
                      src={familyImg3}
                      className="familyProfile"
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="famRow2">
                  <div className="me-3">
                    <span className="memberAdd">Name</span>
                    <p className="memberInfo mb-0">Ankit Jain</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Relation</span>
                    <p className="memberInfo mb-0">Husband</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Birth</span>
                    <p className="memberInfo mb-0">02 Feb 1980</p>
                  </div>
                  <div className="me-3">
                    <span className="memberAdd">Date of Anniversary</span>
                    <p className="memberInfo mb-0">-</p>
                  </div>
                </div>
                <div className="famRow3">
                  <Button className="editmember">Edit</Button>
                  <img src={editIcon} width={35} className="editIconMember" />
                </div>
              </div>
            </div>
          </Card>
          <div className="d-flex justify-content-end mt-2">
            <Button color="primary" onClick={() => openModal("add")}>
              Add
            </Button>
          </div>
          <FamilyModalForm
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            mode={modalMode}
          />
        </div>
      ),
    },
    {
      key: "personal",
      label: t("personal"),
      children: (
        <>
          <div>
            <div className="d-flex flex-row">
              <div className="me-3">
                <span className="memberAdd">PAN Number</span>
                <p className="memberInfo">ASDFG1234T</p>
              </div>
              <div>
                <span className="memberAdd">Alternative Mobile Number</span>
                <p className="memberInfo">+91 9929229992</p>
              </div>
            </div>
            <div>
              <span className="memberAdd">In Memory Name</span>
              <p className="memberInfo">Sharda Jain</p>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "official",
      label: t("official"),
      children: (
        <>
          <div>
            <div className="d-flex flex-row">
              <div className="me-3">
                <span className="memberAdd">Created By</span>
                <p className="memberInfo">Ritwik Jain</p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Updated Date</span>
                <p className="memberInfo">22 Aug 2023</p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Created Date</span>
                <p className="memberInfo">22 Jan 1985</p>
              </div>
              <div className="me-3">
                <span className="memberAdd">Branch</span>
                <p className="memberInfo">Vihar</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="formikwrapper">
      <div className="mb-1">
        <img
          src={arrowLeft}
          className="me-2  cursor-pointer"
          onClick={() => history.push(`/membership`)}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="memberCard" id="firstCard">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <img
                src={profileImg}
                className="membershipProfileImg"
                alt="Profile"
              />
              <p className="memberName">Rohan Jain</p>
              <p className="memberalias">Alias Name</p>
            </div>
            <Card className="memberProfileCard d-flex flex-column align-items-center justify-content-center">
              <p className="card-text-1">Shiromani Shanrakshak</p>
              <p className="card-text-2">2024/GUN/1234</p>
              <p className="card-text-3">Joining Date 22 Jan 2024</p>
            </Card>
            <div className="info-container">
              <div className="info-item">
                <img src={personIcon} alt="Person Icon" /> <span>Male</span>
              </div>
              <div className="info-item">
                <img src={businessIcon} alt="Business Icon" />{" "}
                <span>Businessman</span>
              </div>
              <div className="info-item">
                <img src={calenderIcon} alt="Calendar Icon" />{" "}
                <span>22 Nov 2002</span>
              </div>
              <div className="info-item">
                <img src={ringIcon} alt="Ring Icon" /> <span>Married</span>
              </div>
              <div className="info-item">
                <img src={phoneIcon} alt="Phone Icon" />{" "}
                <span>+91 9972871000</span>
              </div>
              <div className="info-item">
                <img src={whatsappIcon} alt="WhatsApp Icon" />{" "}
                <span>+91 9972871000</span>
              </div>
              <div className="info-item">
                <img src={mailIcon} alt="Mail Icon" />{" "}
                <span>rohan.jain@gmail.com</span>
              </div>
              <div>
                <div className="info-item">
                  <span className="me-1">Future Communication?</span>
                  <Switch checked={toggleSwitch} onChange={handleToggle} />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} sm={12}>
              <Card>
                <div>
                  <span className="memberAdd">Home Address</span>
                  <p className="memberlineAdd">
                    A777, Vaswani Brentwood, VIBGYOR School Road, Bangalore,
                    Bangalore, Karnataka, India, Pin 560066
                  </p>
                </div>
                <div>
                  <span className="memberAdd">Correspondence Address</span>
                  <p className="memberlineAdd">
                    A777, Vaswani Brentwood, VIBGYOR School Road, Bangalore,
                    Bangalore, Karnataka, India, Pin 560066
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={24} sm={12}>
              <div id="lastCard">
                <Card>
                  {" "}
                  <Tabs
                    defaultActiveKey={activeTab}
                    className="memberShipTab"
                    items={items}
                    onChange={handleTabChange}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default MembershipProfileView;
