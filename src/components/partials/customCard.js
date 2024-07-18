import React from "react";
import { Card } from "reactstrap";
import styled from "styled-components";
import "../../../src/styles/common.scss";

const CustomCard = ({ cardTitle, cardNumber, cardImage }) => {
  const CustomCardWrapper = styled.div``;
  return (
    <div className="customcardwrapper">
      <Card className="customCard">
        <div className="d-flex ">
          <div className="">
            <div className="cardtitle">{cardTitle}</div>
            <div className="cardnumber" title={cardNumber}>
              {cardNumber}
            </div>
          </div>
          <div className="cardimage">
            <img src={cardImage} width={80} height={80} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomCard;
