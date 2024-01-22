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

const CattleDashboardCard = ({
  showRupeesSymbol = false,
  title,
  number,
  showCattleDetails,
  showCattleDonation,
  privateDonor,
  govtDonor,
  cow,
  calf,
  bull,
  other,
}) => {
  return (
    <CattleDashboardCardWrapper>
      <div className="customCard">
        <p className="cardTitle">{title}</p>
        <h2 className="cardNumber">
          {!showRupeesSymbol ? number : `₹${number.toLocaleString("en-IN")}`}
        </h2>
        {showCattleDetails && (
          <div className="d-flex justify-content-between ">
            <div>
              <p className="sub-heading">
                Cow:
                <span className="count"> {cow}</span>
              </p>
              <p className="sub-heading">
                Calf:
                <span className="count"> {calf}</span>
              </p>
            </div>
            <div>
              <p className="sub-heading">
                Bull:
                <span className="count"> {bull}</span>
              </p>
              <p className="sub-heading">
                Other:
                <span className="count"> {other}</span>
              </p>
            </div>
          </div>
        )}

        {showCattleDonation && (
          <div className="d-flex justify-content-between ">
            <div>
              <p className="sub-heading">
                Private Donors:
                <span className="count">
                  {" "}
                  ₹{privateDonor.toLocaleString("en-IN")}
                </span>
              </p>
              <p className="sub-heading">
                Govt Donors:
                <span className="count">
                  {" "}
                  ₹{govtDonor.toLocaleString("en-IN")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </CattleDashboardCardWrapper>
  );
};

export default CattleDashboardCard;
