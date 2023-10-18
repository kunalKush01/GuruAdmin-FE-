import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { setCookieWithMainDomain } from "../../utility/formater";

const TrustListModal = ({ trustArray, modal, setModal }) => {
  const redirectTrust = (subDomain, rtoken, atoken) => {
    setCookieWithMainDomain("refreshToken", rtoken, ".paridhan.app");
    setCookieWithMainDomain("accessToken", atoken, ".paridhan.app");
    
    window.location.replace(`https://${subDomain}-dev.paridhan.app/login`)
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
          There are Trust List
          {trustArray?.map((item) => (
            <div>
              {item?.isAproved === "approved" ? (
                <div
                  onClick={() =>
                    redirectTrust(
                      item?.subDomain,
                      item?.refreshToken,
                      item?.accessToken
                    )
                  }
                >
                  <a
                  // href={`https://${item?.subDomain}-staging.paridhan.app/${item?.id}?rtoken=${item?.refreshToken}&atoken=${item?.accessToken}`}
                  >
                    {item?.name}
                  </a>
                </div>
              ) : (
                <p>{item?.name}</p>
              )}{" "}
            </div>
          ))}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default TrustListModal;
