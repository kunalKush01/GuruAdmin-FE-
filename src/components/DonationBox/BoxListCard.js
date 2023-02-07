import React from "react";
import { Card, CardBody, CardFooter, Col, Row } from "reactstrap";
import styled from "styled-components";
import donationBoxIcon from "../../assets/images/icons/donationBox/donationBoxIcon.png";
import editIcon from "../../assets/images/icons/donationBox/editIcon.svg";
import donationBoxDesIcon from "../../assets/images/icons/donationBox/donationBoxDesIcon.png";
import { Button } from "bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import lockIcon from "../../assets/images/icons/donationBox/Lock.svg";
import he from "he";
import { Item } from "react-contexify";
import Swal from "sweetalert2";

const ReportListCardWraper = styled.div`
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

export default function BoxListCard({ data = "" }) {
  const ConvertToString = (html) => {
    console.log("convert Rj", html);
    return html.replace(/(&lt;([^>]+)>)/gi, "");
  };
  const history = useHistory();
  return (
    <ReportListCardWraper>
      <Card>
        <CardBody>
          <Row className=" d-flex justify-content-between w-100 m-0">
            <Col xs={2} className="p-0 d-flex justify-content-center">
              <div style={{ width: "30px" }}>
                {/* {data.isLocked&&<img src={lockIcon} className="w-100"  />} */}
              </div>
            </Col>
            <Col xs={8} className="p-0">
              <div
                className="d-flex flex-column cursor-pointer align-items-center "
                onClick={() => {
                  Swal.fire({
                    padding: "15px 20px",
                    // title: `<img src="${donationBoxIcon}"/>`,
                    html: `
                                            <div class="text-start">
                                                <div>Date : ${moment(
                                                  data.collectionDate
                                                ).format(
                                                  "dddd, DD MMM, YYYY"
                                                )}</div>
                                                <div>
                                                  Amount : ₹ ${data.amount} 
                                                </div>

                                                <div>
                                                  Description:
                                                </div>
                                                <div
                                                class="descriptionBoxSwal"
                                                 style="
                                                 
                                                ">
                                                  ${ConvertToString(data.remarks)}
                                                </div>
                                            </div>
                                              `,
                    showCloseButton: false,
                    showConfirmButton: false,
                    // showCancelButton: true,
                    // focusConfirm: true,
                    cancelButtonText: "cancel",
                    cancelButtonAriaLabel: "cancel",

                    // confirmButtonText:"confirm",
                    // confirmButtonAriaLabel: "Confirm",
                  });
                }}
              >
                <img src={donationBoxIcon} style={{ width: "80px" }} />
                <div className="date">
                  <span>Date :</span>{" "}
                  {moment(data.collectionDate)
                    .utcOffset(0)
                    .format("dddd, DD MMM, YYYY")}
                </div>
                <div className="time">
                  <span>Time :</span>{" "}
                  {moment(data.collectionDate).utcOffset(0).format("h:mm a")}
                </div>
                <div className="time d-flex align-items-center justify-content-between remarks">
                  <img src={donationBoxDesIcon} width={10} />
                  <div
                    className="text-with-dots"
                    dangerouslySetInnerHTML={{
                      __html: he.decode(data.remarks),
                    }}
                  />
                </div>
                <CardFooter className="w-100">
                  <div>₹ {data.amount}</div>
                </CardFooter>
              </div>
            </Col>
            <Col xs={2} className="p-0 d-flex justify-content-center">
              <div style={{ width: "30px" }}>
                {/* {!data.isLocked&&<img src={editIcon} className="w-100 cursor-pointer"
           onClick={() => history.push(`/donation_box/edit/${data.id}`)}
           
           />} */}
                <img
                  src={editIcon}
                  className="w-100 cursor-pointer"
                  onClick={() => history.push(`/donation_box/edit/${data.id}`)}
                />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </ReportListCardWraper>
  );
}
