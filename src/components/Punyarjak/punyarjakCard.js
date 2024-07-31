import { useMutation, useQueryClient } from "@tanstack/react-query";
import he from "he";
import moment from "moment";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import { PublishNews, deleteNewsDetail } from "../../api/newsApi";
import { deletePunyarjak } from "../../api/punarjakApi";
import cardClockIcon from "../../assets/images/icons/news/clockIcon.svg";
import confirmationIcon from "../../assets/images/icons/news/conformationIcon.svg";
import cardThreeDotIcon from "../../assets/images/icons/news/threeDotIcon.svg";
import placeHolder from "../../assets/images/placeholderImages/placeHolder.svg";
import { ConverFirstLatterToCapital } from "../../utility/formater";
import { DELETE, EDIT, WRITE } from "../../utility/permissionsVariable";
import BtnPopover from "../partials/btnPopover";
import { CustomDropDown } from "../partials/customDropDown";
import "../../assets/scss/common.scss";

function BtnContent({
  punyarjakId,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
  totalAvailableLanguage,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const handleDeletePunyarjak = async (payload) => {
    return deletePunyarjak(payload);
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: handleDeletePunyarjak,
    onSuccess: (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(["punyarjak"]);
      }
    },
  });

  const langList = useSelector((state) => state.auth.availableLang);
  return (
    <div className="btncontentwrapper">
      <Row className="MainContainer d-block">
        {allPermissions?.name === "all" || subPermission?.includes(EDIT) ? (
          <Col
            xs={12}
            className="col-item"
            onClick={() =>
              history.push(
                `/punyarjak/edit/${punyarjakId}?page=${currentPage}`,
                punyarjakId
              )
            }
          >
            <Trans i18nKey={"news_popOver_Edit"} />
          </Col>
        ) : (
          ""
        )}
        {allPermissions?.name === "all" || subPermission?.includes(DELETE) ? (
          <Col
            xs={12}
            className="col-item  "
            // onClick={() => deleteMutation.mutate(punyarjakId)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Swal.fire("Oops...", "Something went wrong!", "error");
              Swal.fire({
                title: `<img src="${confirmationIcon}"/>`,
                html: `
                                      <h3 class="swal-heading">${t(
                                        "punyarjak_delete"
                                      )}</h3>
                                      <p>${t("punyarjak_sure")}</p>
                                      `,
                showCloseButton: false,
                showCancelButton: true,
                focusConfirm: true,
                cancelButtonText: `${t("cancel")}`,
                cancelButtonAriaLabel: `${t("cancel")}`,

                confirmButtonText: `${t("confirm")}`,
                confirmButtonAriaLabel: "Confirm",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  deleteMutation.mutate(punyarjakId);
                }
              });
            }}
          >
            <Trans i18nKey={"news_popOver_Delete"} />
          </Col>
        ) : (
          ""
        )}
        {allPermissions?.name === "all" || subPermission?.includes(WRITE) ? (
          <Col
            xs={12}
            className={`${
              langList?.length === totalAvailableLanguage
                ? "col-item-disabled opacity-50"
                : "col-item "
            }`}
            onClick={() =>
              langList?.length === totalAvailableLanguage
                ? ""
                : history.push(
                    `/punyarjak/add-language/${punyarjakId}?page=${currentPage}`,
                    punyarjakId
                  )
            }
          >
            <Trans i18nKey={"news_popOver_AddLang"} />
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
}

export default function PunyarjakCard({
  data,
  currentPage,
  currentFilter,
  subPermission,
  allPermissions,
}) {
  return (
    <div className="punyarjakcardwrapper">
      <Card
        style={{
          width: "100%",
          height: "390px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div className="position-relative imgContainer ">
          <img
            alt="Punyarjak Image"
            style={{
              height: "100%",
              position: "relative",
              objectFit: "cover",
              width: "100%",
              borderBottom: "1px solid rgb(255, 135, 68)",
            }}
            src={data?.image ?? placeHolder}
          />
        </div>

        <CardBody>
          <div className="">
            <CardTitle title={data?.title ?? ""}>
              {ConverFirstLatterToCapital(data?.title ?? "")}
            </CardTitle>

            <CardText>
              <div
                dangerouslySetInnerHTML={{
                  __html: he?.decode(data?.description ?? ""),
                }}
              />
            </CardText>
          </div>
          <div className="cardLangScroll mt-2">
            {data?.languages?.map((item) => {
              return (
                <div key={item.id} className="languageButton">
                  {ConverFirstLatterToCapital(item?.name ?? "")}
                </div>
              );
            })}
          </div>
          <CardFooter>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <img src={cardClockIcon} style={{ verticalAlign: "bottom" }} />
                {`Posted on ${moment(data?.publishDate).format(
                  "D MMMM YYYY "
                )}`}
              </div>
              <img
                src={cardThreeDotIcon}
                className="cursor-pointer"
                id={`popover-${data?.id}`}
              />
            </div>
          </CardFooter>
        </CardBody>
      </Card>
      <BtnPopover
        target={`popover-${data.id}`}
        content={
          <BtnContent
            punyarjakId={data?.id}
            currentPage={currentPage}
            totalAvailableLanguage={data?.languages?.length}
            currentFilter={currentFilter}
            subPermission={subPermission}
            allPermissions={allPermissions}
          />
        }
      />
    </div>
  );
}
