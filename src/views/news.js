import { Form, Formik } from "formik";
import React, { useState } from "react";
import CustomTextField from "../components/partials/customTextField";
import * as yup from "yup";
import RichTextField from "../components/partials/richTextEditorField";
import styled from "styled-components";
import { CustomDropDown } from "../components/partials/customDropDown";
import arrowLeft from "../assets/images/icons/arrow-left.svg";
import { Trans, useTranslation } from "react-i18next";
import { Button, Col, Row } from "reactstrap";
import CustomDatePicker from "../components/partials/CustomDatePicker";
import { createNews, getAllNews } from "../sevices/services";
import { ChangePeriodDropDown } from "../components/partials/changePeriodDropDown";
import NewsCard from "../components/news/newsCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate'


const NewsWarper = styled.div`
  color: #583703;
  font: normal normal bold 20px/33px Noto Sans;
  .ImagesVideos {
    font: normal normal bold 15px/33px Noto Sans;
  }
  .addNews {
    color: #583703;
    display: flex;
    align-items: center;
  }

  .FormikWraper {
    padding: 40px;
  }
  .btn-Published {
    text-align: center;
  }
  .addNews-btn {
    padding: 9px 2rem;
    margin-left: 10px;
  }
  .newsContent {
    height: 350px;
    overflow: auto;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;
const langArray = [
  "English",
  "தமிழ்",
  "हिन्दी",
  "ನೆರಳಿನಲ್ಲೇ",
  "मराठी",
  "ગુજરાતી",
  "తెలుగు",
  "മലയാളം",
];

const handleCreateNews = async (payload) => {
  await createNews(payload);

};

const schema = yup.object().shape({
  Title: yup.string().required("news_title_required"),
  Tags: yup.string().required("news_tags_required"),
  RichTextField: yup.string().required("news_desc_required"),
  Published: yup.string().required("news_publish_required"),
  DateTime: yup.string(),
});
export default function News() {
  const { t } = useTranslation();
  const newsQuerClient = useQueryClient();
  const newsMutation = useMutation({
    mutationFn: handleCreateNews,
    onSuccess:()=> {      
      newsQuerClient.invalidateQueries(["News"])
      setAddNewsActive(false)
    },
  });
  
  const newsQuery = useQuery(["News"], () => getAllNews());  
  const [addNewsActive, setAddNewsActive] = useState(false);

  const [count,setCount] = useState()

  return (
    <NewsWarper>
      {addNewsActive && (
        <div>
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex justify-content-between align-items-center ">
              <img
                src={arrowLeft}
                className="me-2"
                onClick={() => setAddNewsActive(false)}
              />
              <div className="addNews">
                <Trans i18nKey={"news_AddNews"} />
              </div>
            </div>
            <div className="addNews">
              <Trans i18nKey={"news_InputIn"} />
              <CustomDropDown
                ItemListArray={langArray}
                className={"ms-1"}
                defaultDropDownName={"English"}
                disabled
              />
            </div>
          </div>

          <div className="FormikWraper">
            <Formik
              initialValues={{
                Title: "",
                Tags: "",
                RichTextField: "",
                Published: "",
                DateTime: new Date(),
              }}
              onSubmit={(e) =>
                newsMutation.mutate({
                  title: e.Title,
                  tags: e.Tags,
                  body: e.RichTextField,
                  publishDate: e.DateTime,
                  publishedBy: e.Published,
                  imageUrl: "http://newsImage123.co",
                })
              }
              validationSchema={schema}
            >
              {(formik) => (
                <Form>
                  <Row>
                    <Col xs={7}>
                      <Row>
                        <Col>
                          <CustomTextField
                            label={t("news_label_Title")}
                            name="Title"
                          />
                        </Col>
                        <Col>
                          <CustomTextField
                            label={t("news_label_Tags")}
                            name="Tags"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <RichTextField
                            height="100px"
                            label={t("news_label_Description")}
                            name="RichTextField"
                          />
                        </Col>
                      </Row>
                      {/* <Row>
                        <div className="ImagesVideos">
                          <Trans i18nKey={"news_label_ImageVedio"} />
                        </div>
                        <div></div>
                      </Row> */}
                      <Row>
                        <Col xs={6}>
                          <CustomTextField
                            label={t("news_label_Published")}
                            name="Published"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <CustomDatePicker name="DateTime" />
                    </Col>
                  </Row>
                  <div className="btn-Published ">
                    <Button color="primary" type="submit">
                      <Trans i18nKey={"news_button_Publish"} />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {!addNewsActive && (
        <div>
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex justify-content-between align-items-center ">
              <img src={arrowLeft} className="me-2" />
              <div className="addNews">
                <Trans i18nKey={"news_latest_news"} />
              </div>
            </div>
            <div className="addNews">
              <ChangePeriodDropDown
                ItemListArray={langArray}
                className={"ms-1"}
                defaultDropDownName={"English"}
                disabled
              />
              <Button
                color="primary"
                className="addNews-btn"
                onClick={() => setAddNewsActive(true)}
              >
                +Add News
              </Button>
            </div>
          </div>
          <div className="newsContent  ">
            <Row>
              {!newsQuery.isLoading
                ? newsQuery.data.result.map((item) => {
                    return (
                      <Col xs={3} key={item._id}>
                        <NewsCard data={item} />
                      </Col>
                    );
                  })
                : ""}
            </Row>
          </div>
          <ReactPaginate
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        pageCount={count || 1}
        activeClassName='active'
        breakClassName='page-item'
        pageClassName={'page-item'}
        breakLinkClassName='page-link'
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        onPageChange={page => handlePagination(page)}
        // forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
        </div>
        
      )}
    </NewsWarper>
  );
}
