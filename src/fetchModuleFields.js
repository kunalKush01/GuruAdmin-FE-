import axios from "axios";
import { store } from "./redux/store";
import { selectAccessToken } from "./redux/authSlice";
import { ConverFirstLatterToCapital } from "./utility/formater";
const { REACT_APP_BASEURL } = process.env;

const excludedUserFields = [
  "accountNotification",
  "addLine1",
  "addLine2",
  // "address",
  "addressline1",
  "allNotification",
  "cardHolderName",
  "cardNumber",
  // "city",
  // "country",
  "countryCode",
  // "countryName",
  "createdAt",
  "deleteOtp",
  "deletedAt",
  // "district",
  // "dob",
  // "email",
  "imageExpiredAt",
  "isActive",
  "isDeleteRequested",
  "isDeleted",
  "isEmailVerified",
  "isPanVerified",
  "languageId",
  "latitude",
  "longitude",
  // "mobileNumber",
  // "name",
  "otp",
  "panImage",
  "panImageName",
  // "panNum",
  "password",
  // "pin",
  "pinCode",
  "pincode",
  "preferenceId",
  "preferences",
  "profileImage",
  "profileImageName",
  "promotionalNotification",
  "reportedTrust",
  "roles",
  "searchType",
  "socialToken",
  // "state",
  "updatedAt",
  "userId",
  "type"
];
const trustId = localStorage.getItem("trustId");
const accessToken = selectAccessToken(store.getState());

const headers = {
  "Access-Control-Allow-Origin": "*",
  "device-type": "android",
  Authorization: `Bearer ${accessToken}`,
  "x-dharmshala-id": trustId,
};
export const fetchFields = async (trustId, moduleName, excludeFields = [],languageId) => {
  try {
    if (moduleName !== "Member") {
      let apiModuleName = moduleName;
      if (moduleName === "Article_Donation") {
        apiModuleName = "Donation";
      }

      const response = await axios.post(
        `${REACT_APP_BASEURL}${trustId}/schema/${apiModuleName}/fields`,
        {
          EnglishLanguageId: "6332cbba8054b2cac94da3d1",
          languageId: languageId,
        }
      );

      if (response.data?.status && response.data?.data?.result?.fields) {
        const fields = response.data.data.result.fields || {};
        const customFields = response.data.data.result.customFields || [];
        const userFields = fields.user
          ? Object.keys(fields.user || {})
              .filter((key) => !excludedUserFields.includes(key))
              .map((key) => ({
                value: `user_${key}`,
                label: `${key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}`,
                type: fields.user[key]?.type,
              }))
          : [];

        // Extract field options from fields
        const fieldOptions = fields
          ? Object.keys(fields)
              .filter((key) => !excludeFields.includes(key))
              .map((key) => ({
                value: key,
                label: key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase()),
                type: fields[key].type,
                enum: fields[key]?.enum || [],
                valueWithId:fields[key]?.valueWithId||[]
              }))
          : [];

        // Extract custom field options
        const customFieldOptions = customFields
          ? customFields.map((field) => ({
              value: `customFields_${field.fieldName}`,
              label: field.fieldName,
              type: field.fieldType,
              masterKey: field?.masterKey || null,
            }))
          : [];
        // Combine both field types
        return [...fieldOptions, ...userFields, ...customFieldOptions];
      } else {
        console.warn("No fields found in the response.");
        return [];
      }
    } else {
      const response = await axios.get(
        `${REACT_APP_BASEURL}${trustId}/memberSchema`,
        { headers }
      );

      if (response.data?.status && response.data?.data?.schema?.memberSchema) {
        const memberSchema = response.data.data.schema.memberSchema;
        function transformSchema(schema) {
          let output = [];

          function traverseSchema(properties, parentKey = "") {
            if (parentKey == "upload") {
              return false;
            }
            for (let key in properties) {
              const property = properties[key];
              console.log(`${parentKey}_${key}`);
              const currentKey = parentKey
                ? `${parentKey}_${key}${properties[key]?.enum ? "_name" : ""}`
                : key;
              if (property.type === "object") {
                traverseSchema(property.properties, currentKey);
              } else if (property.title) {
                output.push({
                  value: currentKey,
                  label: property.title,
                  type: ConverFirstLatterToCapital(property.type),
                  enum: properties[key]?.enum || [],
                });
              }
            }
          }

          traverseSchema(schema.properties);
          return output;
        }

        const result = transformSchema(memberSchema);
        return result;
      } else {
        console.warn("No fields found in the response.");
        return [];
      }
    }
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
};
