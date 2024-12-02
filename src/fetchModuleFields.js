import axios from "axios";
const { REACT_APP_BASEURL } = process.env;
const excludedUserFields = [
  "password",
  "isEmailVerified",
  "socialToken",
  "countryCode",
  "pin",
  "searchType",
  "roles",
  "preferences",
  "otp",
  "deleteOtp",
  "isDeleteRequested",
  "deletedAt",
  "updatedAt",
  "createdAt",
];
export const fetchFields = async (trustId, moduleName, excludeFields = []) => {
  try {
    const response = await axios.get(
      `${REACT_APP_BASEURL}/${trustId}/schema/${moduleName}/fields`
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
            }))
        : [];

      // Extract custom field options
      const customFieldOptions = customFields
        ? customFields.map((field) => ({
            value: `customFields_${field.fieldName}`,
            label: field.fieldName,
            type: field.fieldType,
          }))
        : [];

      // Combine both field types
      return [...fieldOptions, ...userFields, ...customFieldOptions];
    } else {
      console.warn("No fields found in the response.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
};
