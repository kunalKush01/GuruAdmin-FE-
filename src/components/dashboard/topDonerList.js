import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  Label,
  Tooltip,
  UncontrolledTooltip,
} from "reactstrap";
import styled from "styled-components";
import { showInAppTopDonors } from "../../api/dashboard";
import palceHolderIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import rank1 from "../../assets/images/icons/dashBoard/rank1.svg";
import rank2 from "../../assets/images/icons/dashBoard/rank2.svg";
import rank3 from "../../assets/images/icons/dashBoard/rank3.svg";
import rank4 from "../../assets/images/icons/dashBoard/rank4.svg";
import rank5 from "../../assets/images/icons/dashBoard/rank5.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import '../../../src/styles/common.scss';

export const TopDonerList = ({ data }) => {
  const { t } = useTranslation();

  const showTopDonor = useSelector(
    (state) => state?.auth?.trustDetail?.showTopDonor
  );

  const [toggleState, setToggleState] = useState(showTopDonor ?? false);

;
;
  const getRank = (idx) => {
    switch (idx + 1) {
      case 1:
        return rank1;
      case 2:
        return rank2;
      case 3:
        return rank3;
      case 4:
        return rank4;
      case 5:
        return rank5;
      default:
        break;
    }
  };
  return (
    <div className="topdonerwarpper">
      <div className="d-flex listHeading justify-content-between">
        <p>
          <Trans i18nKey={"dashboard_top"} />
        </p>

        <div className="position-relative">
          <FormGroup switch id="showInApp">
            <Input
              type="switch"
              checked={toggleState}
              role="switch"
              onChange={(e) => {
                setTimeout(async () => {
                  setToggleState(!toggleState);
                  await showInAppTopDonors(e.target.checked);
                }, 500);
              }}
            />
            <UncontrolledTooltip placement="top" target="showInApp">
              Show in app
            </UncontrolledTooltip>
            {/* <Label check>Show in app</Label> */}
          </FormGroup>
        </div>
      </div>
      <div className="listContainer d-flex justify-content-between flex-column">
        {data?.map((item, idx) => (
          <Card key={item.id} className="  rounded-3">
            <CardBody className="d-flex p-1 justify-content-between align-items-center   ">
              <div className="d-flex align-items-center">
                <img
                  src={
                    item?.user?.profileImage !== "" && item?.user?.profileImage
                      ? item?.user?.profileImage
                      : palceHolderIcon
                  }
                  className="rounded-circle o"
                  width={"50px"}
                  height={"50px"}
                  style={{ objectFit: "cover" }}
                />
                <div className="">
                  <div className="headName ps-1">
                    {ConverFirstLatterToCapital(item?.user?.name ?? "")}
                  </div>
                </div>
              </div>
              <img src={getRank(idx)} width={"30px"} />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
