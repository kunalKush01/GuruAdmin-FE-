import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardBody, CardImg } from "reactstrap";
import styled from "styled-components";
import palceHolderIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import rank1 from "../../assets/images/icons/dashBoard/rank1.svg";
import rank2 from "../../assets/images/icons/dashBoard/rank2.svg";
import rank3 from "../../assets/images/icons/dashBoard/rank3.svg";
import rank4 from "../../assets/images/icons/dashBoard/rank4.svg";
import rank5 from "../../assets/images/icons/dashBoard/rank5.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";

export const TopDonerList = ({ data }) => {
  const { t } = useTranslation();
  const TopDonerWarpper = styled.div`
    height: auto;
    .listHeading {
      color: #583703;
      font: normal normal bold 20px/23px Noto Sans;
    }

    .listContainer {
      border: 2px solid #ff8744;
      height: 100%;
      border-radius: 10px;
      color: #583703;
    }
    font: normal normal normal 13px/20px Noto Sans;

    .headName {
      font: normal normal bold 15px/20px Noto Sans;
    }
    .card {
      background-color: #fff7e8;
      margin: 5px 10px;
    }
  `;
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
    <TopDonerWarpper>
      <div className="d-flex listHeading justify-content-between">
        <p>
          <Trans i18nKey={"dashboard_top"} />
        </p>
      </div>
      <div className="listContainer d-flex justify-content-between flex-column">
        {data?.map((item, idx) => (
          <Card key={item.id} className="  rounded-3">
            <CardBody className="d-flex p-1 justify-content-between align-items-center   ">
              <div className="d-flex align-items-center">
                <img
                  src={item?.user?.profileImage !==  "" &&  item?.user?.profileImage  ? item?.user?.profileImage :   palceHolderIcon}
                  className="rounded-circle o"
                  width={"50px"}
                  height={"50px"}
                  style={{objectFit:'cover'}}
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
    </TopDonerWarpper>
  );
};
