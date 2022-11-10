import moment from "moment";
import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
  CardFooter,
} from "reactstrap";
import he from "he";
import styled from "styled-components";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";

const NewsCardWaraper = styled.div`
  .imgContainer {
    border-radius: 10px 10px 0px 0px;
    img {
      border-radius: 10px 10px 0px 0px;
    }
  }
  .card-title {
    font: normal normal bold 13px/16px Noto Sans;
    margin-bottom: 10px !important;
  }
  .card-text {
    font: normal normal normal 12px/16px Noto Sans;
    height: 50px;
    overflow: hidden;
  }
  .card-body {
    background: #fff7e8;
    padding: 10px;
  }
  .btn-outline-primary {
    border: 2px solid #ff8744 !important;
    font: normal normal bold 14px/15px Noto Sans;
    padding: 5px 10px;
    border-radius: 20px;
    margin-right: 10px;
  }

  .card-footer {
    font: normal normal bold 10px/15px Noto sans;
    border: none !important;
    padding: 16px 0px 10px 0px;
    div > div > img {
      width: 15px;
      margin-right: 5px;
    }
    img {
      width: 30px;
    }
  }
  .imgContent {
    top: 80%;
    color: #fff;
    padding: 0px 5px;
    font: normal normal bold 12px/30px noto sans;
  }
`;
export default function NewsCard({ data }) {
  return (
    <NewsCardWaraper>
      <Card
        style={{
          width: "300px",
          
        }}
      >
        <div className="position-relative imgContainer ">
          <img
            alt="Sample"
            style={{
              height: "150px",
              position: "relative",
              width: "100%",
            }}
            src="https://picsum.photos/300/200"
          />
          <div className=" position-absolute imgContent  w-100 ">
            <div className="text-end">
              {`${moment(data.publishDate).startOf("hour").fromNow()}`}
            </div>
          </div>
        </div>

        <CardBody>
          <CardTitle>{data.title}</CardTitle>

          <CardText>
            <div
              dangerouslySetInnerHTML={{
                __html: he.decode(data.body),
              }}
            />
          </CardText>

          <div>
            {data.languages.map((item) => {
              return (
                <Button outline key={item.id} color="primary">
                  {ConverFirstLatterToCapital(item.name)}
                </Button>
              );
            })}
          </div>
          <CardFooter>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <img src={cardClockIcon} style={{ verticalAlign: "bottom" }} />
                Posted on {`${moment(data.publishDate).format("D MMMM YYYY ")}`}
              </div>
              <img src={cardThreeDotIcon} />
            </div>
          </CardFooter>
        </CardBody>
      </Card>
    </NewsCardWaraper>
  );
}
