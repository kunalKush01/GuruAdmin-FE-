import { at } from "lodash";
import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { setCookieWithMainDomain } from "../../utility/formater";

const TrustListModal = ({ trustArray, modal, setModal, rToken, aToken }) => {
  const redirectTrust = (subDomain, rtoken, atoken) => {
    console.log('rtoken',rtoken);
    // setCookieWithMainDomain("refreshToken", rtoken, ".paridhan.app");
    // setCookieWithMainDomain("accessToken", atoken, ".paridhan.app");

    window.location.replace(`https://${subDomain}-dev.paridhan.app/login`);
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
          There are Trust List
          {trustArray?.map((item) => (
            <div>
              {item?.isAproved === "approved" ? (
                <div
                  onClick={() => redirectTrust(item?.subDomain, rToken, aToken)}
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
