import { Card, CardBody, CardImg } from "reactstrap";
import styled from "styled-components";
import palceHolderIcon from "../../assets/images/icons/dashBoard/defaultAvatar.svg";
import rank1 from "../../assets/images/icons/dashBoard/rank1.svg";


export const TopDonerList = () => {
  const TopDonerWarpper = styled.div`
    border: 2px solid #ff8744;
    color: #583703;    
    font: normal normal normal 13px/20px Noto Sans;

    .headName{
        font: normal normal bold 15px/20px Noto Sans
    }
    .card{
        background-color: #FFF7E8;
    }
    

  `;

  return (
    <TopDonerWarpper>
      <Card className="m-1 rounded-3" >
        <CardBody className="d-flex p-1    ">
          <img src={palceHolderIcon} className="w-25 pe-1 " />
          <div className="pe-1"  >
            <div className="headName"  >Jai Shah</div>
            <span  >Jodhpur,Rajasthan </span>
            <span  >Bhandasar Temple</span>
          </div>
          <img src={rank1} className="w-25" />
        </CardBody>
      </Card>
      <Card className="m-1 rounded-3" >
        <CardBody className="d-flex p-1  ">
          <img src={palceHolderIcon} className="w-25 pe-1 " />
          <div className="pe-1"  >
            <div className="headName"  >Jai Shah</div>
            <span  >Jodhpur,Rajasthan </span>
            <span  >Bhandasar Temple</span>
          </div>
          <img src={rank1} className="w-25" />
        </CardBody>
      </Card>
      <Card className="m-1 rounded-3" >
        <CardBody className="d-flex p-1  ">
          <img src={palceHolderIcon} className="w-25 pe-1 " />
          <div className="pe-1"  >
            <div className="headName"  >Jai Shah</div>
            <span  >Jodhpur,Rajasthan </span>
            <span  >Bhandasar Temple</span>
          </div>
          <img src={rank1} className="w-25" />
        </CardBody>
      </Card>
      <Card className="m-1 rounded-3" >
        <CardBody className="d-flex p-1  ">
          <img src={palceHolderIcon} className="w-25 pe-1 " />
          <div className="pe-1"  >
            <div className="headName"  >Jai Shah</div>
            <span  >Jodhpur,Rajasthan </span>
            <span  >Bhandasar Temple</span>
          </div>
          <img src={rank1} className="w-25" />
        </CardBody>
      </Card>
      <Card className="m-1 rounded-3" >
        <CardBody className="d-flex p-1  ">
          <img src={palceHolderIcon} className="w-25 pe-1 " />
          <div className="pe-1"  >
            <div className="headName"  >Jai Shah</div>
            <span  >Jodhpur,Rajasthan </span>
            <span  >Bhandasar Temple</span>
          </div>
          <img src={rank1} className="w-25" />
        </CardBody>
      </Card>
    </TopDonerWarpper>
  );
};
