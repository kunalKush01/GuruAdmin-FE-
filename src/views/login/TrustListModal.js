import { at } from "lodash";
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { setCookieWithMainDomain } from "../../utility/formater";

const TrustModalWrapper = styled.div`
  .trustItem,
  .notApproved {
    color: #583703;
    font-size: 17px;
    margin: 0px;
    padding: 0.5rem;
    font-weight: 400;
    line-height: 25px;
  }
  p {
    margin: 0px;
  }
  .hoverItem:hover {
    background: #ff8744;
    cursor: pointer;
    color: white !important;
  }
  .notApproved {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .notApproved > span {
    color: red;
    font-size: 14px !important;
  }
`;

const TrustListModal = ({ trustArray, modal, setModal, rToken, aToken }) => {
  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;

  const redirectTrust = (subDomain, rtoken, atoken) => {
    // console.log("rtoken", rtoken);
    // setCookieWithMainDomain("refreshToken", rtoken, ".paridhan.app");
    // setCookieWithMainDomain("accessToken", atoken, ".paridhan.app");

    window.location.replace(`https://${subDomain}${subdomainChange}/login`);
    // window.location.replace(`http://${subDomain}-dev.localhost:3000/login`);
  };

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={() => {
          setModal(false);
        }}
        centered
      >
        <ModalBody>
          <h3
            style={{ color: "#583703", fontWeight: 600, textAlign: "center" }}
          >
            Trust you are associated with.
          </h3>
          <hr />
          {trustArray?.map((item, idx) => (
            <TrustModalWrapper>
              {item?.isAproved === "approved" ? (
                <div
                  className="trustItem hoverItem"
                  onClick={() => redirectTrust(item?.subDomain, rToken, aToken)}
                >
                  <a
                  // href={`https://${item?.subDomain}-staging.paridhan.app/${item?.id}?rtoken=${item?.refreshToken}&atoken=${item?.accessToken}`}
                  >
                    {item?.name}
                  </a>
                </div>
              ) : (
                <div className="notApproved hoverItem">
                  <p>{item?.name}</p>
                  <span>Not Approved</span>
                </div>
              )}{" "}
            </TrustModalWrapper>
          ))}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TrustListModal;
