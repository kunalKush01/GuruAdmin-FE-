import React from "react";
import { Helmet } from "react-helmet";
import { Trans } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import MemberShipListTable from "../../components/membership/MemberShipListTable";
import "../../assets/scss/common.scss";
import "../../assets/scss/viewCommon.scss";
import { useHistory } from "react-router-dom";

function MemberShipListView() {
  const history = useHistory()
  const data = [
    {
      key: "1",
      memberName: "Rohan Jain",
      aliasName: "RohanJ",
      membershipStatus: "Active",
      membershipNumber: "2024/GUN/1234",
      joiningDate: "2024-01-22",
      gender: "Male",
      occupation: "Businessman",
      dateOfBirth: "2002-11-22",
      maritalStatus: "Married",
      phone: "+91 9972871000",
      whatsapp: "+91 9972871000",
      email: "rohan.jain@gmail.com",
      homeAddress:
        "A777, Vaswani Brentwood, VIBGYOR School Road, Bangalore, Karnataka, India, Pin 560066",
      correspondenceAddress:
        "A777, Vaswani Brentwood, VIBGYOR School Road, Bangalore, Karnataka, India, Pin 560066",
    },
    {
      key: "2",
      memberName: "Anita Sharma",
      aliasName: "AnitaS",
      membershipStatus: "Inactive",
      membershipNumber: "2024/SHM/5678",
      joiningDate: "2023-05-15",
      gender: "Female",
      occupation: "Teacher",
      dateOfBirth: "1985-09-10",
      maritalStatus: "Single",
      phone: "+91 8888777777",
      whatsapp: "+91 8888777777",
      email: "anita.sharma@gmail.com",
      homeAddress: "B123, Green Park, Sector 21, Delhi, India, Pin 110021",
      correspondenceAddress:
        "B123, Green Park, Sector 21, Delhi, India, Pin 110021",
    },
    {
      key: "3",
      memberName: "Vikram Singh",
      aliasName: "VikramS",
      membershipStatus: "Active",
      membershipNumber: "2024/SNG/9101",
      joiningDate: "2024-03-10",
      gender: "Male",
      occupation: "Engineer",
      dateOfBirth: "1990-06-30",
      maritalStatus: "Married",
      phone: "+91 9999888888",
      whatsapp: "+91 9999888888",
      email: "vikram.singh@gmail.com",
      homeAddress:
        "C456, Bright Enclave, MG Road, Mumbai, Maharashtra, India, Pin 400001",
      correspondenceAddress:
        "C456, Bright Enclave, MG Road, Mumbai, Maharashtra, India, Pin 400001",
    },
    {
      key: "4",
      memberName: "Priya Gupta",
      aliasName: "PriyaG",
      membershipStatus: "Active",
      membershipNumber: "2024/GUP/2345",
      joiningDate: "2024-02-20",
      gender: "Female",
      occupation: "Doctor",
      dateOfBirth: "1988-12-05",
      maritalStatus: "Married",
      phone: "+91 7777888888",
      whatsapp: "+91 7777888888",
      email: "priya.gupta@gmail.com",
      homeAddress:
        "D789, Elite Residency, Park Avenue, Chennai, Tamil Nadu, India, Pin 600002",
      correspondenceAddress:
        "D789, Elite Residency, Park Avenue, Chennai, Tamil Nadu, India, Pin 600002",
    },
  ];
  return (
    <div className="listviewwrapper">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Apna Dharm Admin | Membership</title>
      </Helmet>
      <div className="window nav statusBar body "></div>

      <div>
        <div className="d-lg-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-lg-0">
            <div className="addAction d-flex">
              <div className="">
                <div>
                  <Trans i18nKey={"membership"} />
                </div>
              </div>
            </div>
          </div>
          <div className="addAction d-flex flex-wrap gap-2 gap-md-0">
            <Button
              className={`secondaryAction-btn me-1`}
              color="primary"
              onClick={() => history.push(`/member/addMember`)}
            >
              Add
            </Button>

            <input
              type="file"
              //   ref={importFileRef}
              accept=""
              className="d-none"
              //   onChange={handleImportFile}
            />
          </div>
        </div>
        <div style={{ height: "10px" }}></div>
        <div className="commitmentContent">
          <Row>
            <MemberShipListTable data={data} />
          </Row>
        </div>
      </div>
    </div>
  );
}

export default MemberShipListView;
