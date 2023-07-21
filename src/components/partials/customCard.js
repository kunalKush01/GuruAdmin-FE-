import React from "react";
import { Card } from "reactstrap";
import styled from "styled-components";

const CustomCard = ({ cardTitle, cardNumber, cardImage }) => {
  const CustomCardWaraper = styled.div`
  width: 100%;
  height: 100%;
    .customCard {
      background-color: #fff7e8;
      padding: 1.5rem;
      width: 100%;
      height: 100%;
      
    }
    .cardtitle {
      font-size: 22px;
      font-family: Noto Sans;
      font-weight: bold;
      color: #583703;
    }
    .cardnumber {
      font-family: Noto Sans;
      font-weight: bold;
      color: #583703;
      overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
    max-width: 180px;
      font-size: 30px;
      line-height: 75px;
    }
    .cardimage {
      margin-top: 3rem;
    }
  `;

  return (
    <CustomCardWaraper>
      <Card
        className="customCard"
      >
        <div className="d-flex ">
          <div className="">
            <div className="cardtitle">{cardTitle}</div>
            <div className="cardnumber" title={cardNumber}>{cardNumber}</div>
          </div>
          <div className="cardimage">
            <img src={cardImage} width={80} height={80} />
          </div>
        </div>
      </Card>
    </CustomCardWaraper>
  );
};

export default CustomCard;
