import he from "he";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, CardFooter, Col, Row } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import donationBoxDesIcon from "../../assets/images/icons/donationBox/donationBoxDesIcon.png";
import donationBoxIcon from "../../assets/images/icons/donationBox/donationBoxIcon.png";
import editIcon from "../../assets/images/icons/donationBox/editIcon.svg";
import { EDIT } from "../../utility/permissionsVariable";

const DonationBoxWrapper = styled.div`
  .card-footer {
    border: none !important;
    padding: 0%;
    div {
      font: normal normal bold 13px/27px Noto Sans !important ;
      text-align: center;
      color: #ff8744;
      border: 1px solid #ff8744;
      border-radius: 50px;
    }
  }
  .card-body,
  .card {
    border-radius: 20px;
    background-color: #fff7e8;
  }
  .date {
    font: normal normal 600 10px/20px Noto Sans;
    span {
      color: #ff8744;
    }
  }
  .time {
    p {
      margin: 0;
    }
    font: normal normal 600 10px/20px Noto Sans;
    img {
      width: 15px;
      margin-right: 5px;
    }
    span {
      color: #ff8744;
    }
  }
  .remarks {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .text-with-dots {
    max-height: 20px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
`;

export default function BoxListCard({
  data = "",
  currentFilter,
  currentPage,
  subPermission,
  allPermissions,
}) {
  const ConvertToString = (html) => {
    return html.replace(/(&lt;([^>]+)>)/gi, "");
  };
  const history = useHistory();
  return (
    <DonationBoxWrapper>
      <Card>
        <CardBody>
          <Row className=" d-flex justify-content-between w-100 m-0">
            <Col xs={2} className="p-0 d-flex justify-content-center">
              <div style={{ width: "30px" }}></div>
            </Col>
            <Col xs={8} className="p-0">
              <div
                className="d-flex flex-column cursor-pointer align-items-center "
                onClick={() => {
                  Swal.fire({
                    padding: "15px 20px",
                    html: `<div className="text-start">
                                                <div>Date : ${moment(
                                                  data.collectionDate
                                                ).format(
                                                  "dddd, DD MMM, YYYY"
                                                )}</div>
                                                <div>
                                                  Amount : ₹${data?.amount.toLocaleString(
                                                    "en-IN"
                                                  )} 
                                                </div>

                                                <div>
                                                  Description: <span className='descriptionBoxSwal'>
                                                  ${ConvertToString(
                                                    data?.remarks
                                                  )}
                                                  </span> 
                                                </div>
                                            </div>
                                              `,
                    showCloseButton: false,
                    showConfirmButton: false,
                    cancelButtonText: "cancel",
                    cancelButtonAriaLabel: "cancel",
                  });
                }}
              >
                <img src={donationBoxIcon} style={{ width: "80px" }} />
                <div className="date">
                  <span>Date :</span>{" "}
                  {moment(data.collectionDate).format("dddd, DD MMM, YYYY")}
                </div>
                <div className="time">
                  <span>Time :</span>{" "}
                  {moment(data.collectionDate).format("h:mm a")}
                </div>
                <div className="time d-flex align-items-center justify-content-between remarks">
                  <img src={donationBoxDesIcon} width={10} />
                  <div
                    className="text-with-dots"
                    dangerouslySetInnerHTML={{
                      __html: he?.decode(data.remarks),
                    }}
                  />
                </div>
                <CardFooter className="w-100">
                  <div>₹{data?.amount.toLocaleString("en-IN")}</div>
                </CardFooter>
              </div>
            </Col>
            <Col xs={2} className="p-0 d-flex justify-content-center">
              {allPermissions?.name === "all" ||
              subPermission?.includes(EDIT) ? (
                <div style={{ width: "30px" }}>
                  <img
                    src={editIcon}
                    className="w-100 cursor-pointer"
                    onClick={() =>
                      history.push(
                        `/hundi/edit/${data.id}?page=${currentPage}&filter=${currentFilter}`
                      )
                    }
                  />
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </DonationBoxWrapper>
  );
}
