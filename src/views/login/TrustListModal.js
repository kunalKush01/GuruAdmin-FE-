import { at } from "lodash";
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { setCookieWithMainDomain } from "../../utility/formater";

import '../../styles/viewCommon.scss';
;

const TrustListModal = ({ trustArray, modal, setModal, rToken, aToken }) => {
  const subdomainChange = process.env.REACT_APP_ADMIN_SUBDOMAIN_REPLACE_URL;

  const redirectTrust = (subDomain, rtoken, atoken) => {
    window.location.replace(`https://${subDomain}${subdomainChange}/login`);
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
            <div className="trustmodalwrapper">
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
            </div>
          ))}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TrustListModal;
