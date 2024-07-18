import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { deleteNewsDetail } from "../../api/newsApi";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
// import { ConverFirstLatterToCapital } from "../../utility/formater";
import BtnPopover from "../partials/btnPopover";
// import { CustomDropDown } from "../partials/customDropDown";

const CategoryCardWrapper = styled.div``;
;
function BtnContent({ newsId }) {
  const history = useHistory();
  const BtnContentWraper = styled.div``;
;

  const handleDeleteCategory = async (payload) => {
    return deleteNewsDetail(payload);
  };
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: handleDeleteCategory,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["Categories"]);
      }
    },
  });

  return (
    <div className="btncontentwraper">
      <Row className="MainContainer">
        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/news/add-language/${newsId}`, newsId)}
        >
          <Trans i18nKey={"news_popOver_AddLang"} />
        </Col>

        <Col
          xs={12}
          className="col-item"
          onClick={() => history.push(`/news/edit/${newsId}`, newsId)}
        >
          <Trans i18nKey={"news_popOver_Edit"} />
        </Col>

        <Col
          xs={12}
          className="col-item  "
          // onClick={() => deleteMutation.mutate(newsId)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Swal.fire("Oops...", "Something went wrong!", "error");
            Swal.fire({
              title: `<img src="${confirmationIcon}"/>`,
              html: `
                                      <h3 class="swal-heading">Delete Category</h3>
                                      <p>Are you sure you want to permanently delete the selected category ?</p>
                                      `,
              showCloseButton: false,
              showCancelButton: true,
              focusConfirm: true,
              cancelButtonText: "Cancel",
              cancelButtonAriaLabel: "Cancel",

              confirmButtonText: "Confirm Delete",
              confirmButtonAriaLabel: "Confirm",
            }).then(async (result) => {
              if (result.isConfirmed) {
                deleteMutation.mutate(newsId);
              }
            });
          }}
        >
          <Trans i18nKey={"news_popOver_Delete"} />
        </Col>
      </Row>
    </div>
  );
}

export default function CategoryCard({ data }) {
  return (
    <div className="categorycardwrapper">
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
                __html: he?.decode(data?.body ?? ""),
              }}
            />
          </CardText>

          <CardFooter>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <img src={cardClockIcon} style={{ verticalAlign: "bottom" }} />
                Posted on {`${moment(data.publishDate).format("D MMMM YYYY ")}`}
              </div>

              <img src={cardThreeDotIcon} id={`popover-${data.id}`} />
            </div>
          </CardFooter>
        </CardBody>
      </Card>
      <BtnPopover
        target={`popover-${data.id}`}
        content={<BtnContent newsId={data.id} />}
      />
    </div>
  );
}
