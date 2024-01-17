import React from "react";
import styled from "styled-components";

const CattleDashboardCardWrapper = styled.div`
  width: 100%;
  height: 180px;
  .customCard {
    background-color: #fff7e8;
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .cardTitle {
    font-size: 17px;
    font-family: Noto Sans;
    color: #583703;
  }
  .cardNumber {
    font-size: 25px;
    font-weight: bold;
    color: #583703;
  }
  .sub-heading {
    font-weight: bold;
    color: #583703;
    margin: 0.5rem 0;
  }
  .count {
    font-weight: normal;
    color: #583703;
  }
`;

const CattleDashboardCard = ({ title, number, showSubDetails }) => {
  return (
    <CattleDashboardCardWrapper>
      <div className="customCard">
        <p className="cardTitle">{title}</p>
        <h2 className="cardNumber">{number}</h2>
        {showSubDetails && (
          <div className="d-flex justify-content-between ">
            <div>
              <p className="sub-heading">
                Cow:
                <span className="count"> 250</span>
              </p>
              <p className="sub-heading">
                Calf:
                <span className="count"> 150</span>
              </p>
            </div>
            <div>
              <p className="sub-heading">
                Bull:
                <span className="count"> 250</span>
              </p>
              <p className="sub-heading">
                Other:
                <span className="count"> 150</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </CattleDashboardCardWrapper>
  );
};

export default CattleDashboardCard;
