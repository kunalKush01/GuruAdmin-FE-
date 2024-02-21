import React from "react";
import styled from "styled-components";

const CattleDashboardCardWrapper = styled.div`
  width: 100%;
  height: 150px;
  .customCard {
    background-color: #fff7e8;
    padding: 1.5rem;
    width: 400px;
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
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    color: #583703;
  }
  .sub-heading {
    font-weight: bold;
    color: #583703;
    margin: 0.5rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
  }
  .count {
    font-weight: normal;
    color: #583703;
  }
`;

const CattleDashboardCard = ({
  showRupeesSymbol = false,
  ShowSubDetails = false,
  title,
  number,
  data,
}) => {
  return (
    <CattleDashboardCardWrapper>
      <div className="customCard">
        <p className="cardTitle">{title}</p>
        <h2
          className="cardNumber"
          title={
            !showRupeesSymbol
              ? number
              : `₹${number.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
        >
          {!showRupeesSymbol
            ? number
            : `₹${number.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
        </h2>

        {ShowSubDetails && (
          <div className="d-flex justify-content-between ">
            {data?.map((item, idx) => (
              <p className="sub-heading" key={idx}>
                {item?.heading}
                {":"}{" "}
                <span
                  className="count"
                  title={
                    showRupeesSymbol
                      ? "₹" +
                        item?.value.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : item?.value
                  }
                >
                  {showRupeesSymbol
                    ? "₹" +
                      item?.value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : item?.value}
                </span>
              </p>
            ))}
          </div>
        )}

        {/* {showCattleDetails && (
          <div className="d-flex justify-content-between ">
            <p className="sub-heading">
              Cow:
              <span className="count"> {cow}</span>
            </p>
            <p className="sub-heading">
              Calf:
              <span className="count"> {calf}</span>
            </p>

            <p className="sub-heading">
              Bull:
              <span className="count"> {bull}</span>
            </p>
            <p className="sub-heading">
              Other:
              <span className="count"> {other}</span>
            </p>
          </div>
        )} */}

        {/* {showCattleDonation && (
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
        )} */}
      </div>
    </CattleDashboardCardWrapper>
  );
};

export default CattleDashboardCard;
