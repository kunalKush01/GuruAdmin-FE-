import React from "react";
import { Card, CardBody, CardFooter, Col, Row } from "reactstrap";
import styled from "styled-components";
import donationBoxIcon from "../../assets/images/icons/donationBox/donationBoxIcon.png";
import editIcon from "../../assets/images/icons/donationBox/editIcon.svg";
import donationBoxDesIcon from "../../assets/images/icons/donationBox/donationBoxDesIcon.png";
import { Button } from "bootstrap";
import moment from "moment";


const ReportListCardWraper = styled.div`
  
  .card-footer{
    border: none !important;
    padding: 0%;
    div{
      font: normal normal bold 13px/27px Noto Sans  !important ;
      text-align: center;
      color: #FF8744;
      border: 1px solid #FF8744 ;
      border-radius: 50px;
      
      
    }
  }
  
  .card-body, .card{
    border-radius:20px ;
  background-color: #FFF7E8;
  
}
  .date {
    font: normal normal 600 10px/20px Noto Sans;
    span{
      color: #FF8744;
    }
  }
  .time{
    font: normal normal 600 10px/20px Noto Sans;
    img{
      width: 15px ;
    }
    span{
      color: #FF8744;
    }
    
  }
`;

export default function ReportListCard({data=""}) {
  return (
    <ReportListCardWraper >
      <Card>
        <CardBody  >
          <Row className=" d-flex justify-content-between w-100 m-0" >
          <Col xs={2} className="p-0 d-flex justify-content-center" >
              <div style={{ width: "30px" }} >
          <img src={editIcon} className="w-100"  />

              </div>
            </Col>
            <Col xs={8} className="p-0 " >
          <div className="d-flex flex-column    align-items-center  " >

          <img src={donationBoxIcon} style={{ width: "80px" }} />
          <div className="date">
            <span>Date :</span> {moment(data.collectionDate).utcOffset(0).format("D MMMM YYYY")}
          </div>
          <div className="time">
            <span>Time :</span>  {moment(data.collectionDate).utcOffset(0).format("h:mm a")}
          </div>
          <div className="time">
            <img src={donationBoxDesIcon}  />  {data.remarks}
          </div>
        <CardFooter className="w-100" >
          <div>
              ₹ {data.amount}
          </div>
        </CardFooter>
          </div>
            </Col>
            <Col xs={2} className="p-0 d-flex justify-content-center" >
              <div style={{ width: "30px" }} >
          <img src={editIcon} className="w-100"  />

              </div>
            </Col>
          </Row>

        </CardBody>
      </Card>
    </ReportListCardWraper>
  );
}
