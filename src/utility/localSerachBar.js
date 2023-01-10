import {useHistory} from "react-router-dom";

const serchablepath= [

    "/notification",
    "/subscribed-user",
    "/news",
    "/events",
    "/notices",
    "/configuration/categories",
    "/configuration/users",
    "/configuration/reportDispute",
    "/internal_expenses",
    "/financial_reports",
    "/donation",
    "/commitment",
    "/donation_box",
];
export const isSerchable = (pathName)=>{



 return  serchablepath.includes(pathName)
}