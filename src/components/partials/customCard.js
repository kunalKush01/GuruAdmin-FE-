import React from "react";
import { Card } from "reactstrap";
import styled from "styled-components";

const CustomCard = ({ cardTitle, cardNumber, cardImage }) => {
  const CustomCardWaraper = styled.div`
    .customCard {
      background-color: #fff7e8;
      padding: 40px 25px 43px 25px;
      width: 25rem;
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
            <div className="cardnumber">{cardNumber}</div>
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
