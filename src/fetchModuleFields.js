import axios from "axios";
const { REACT_APP_BASEURL } = process.env;

export const fetchFields = async (trustId, moduleName, excludeFields = []) => {
  try {
    const response = await axios.get(
      `${REACT_APP_BASEURL}/${trustId}/schema/${moduleName}/fields`
    );

    if (response.data?.status && response.data?.data?.result?.fields) {
      const fields = response.data.data.result.fields;
      const customFields = response.data.data.result.customFields;

      // Extract field options from fields
      const fieldOptions = Object.keys(fields)
        .filter((key) => !excludeFields.includes(key))
        .map((key) => ({
          value: key,
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          type: fields[key].type,
        }));

      // Extract custom field options
      const customFieldOptions = customFields.map((field) => ({
        value: field.fieldName,
        label: field.fieldName,
        type: field.type,
      }));

      // Combine both field types
      return [...fieldOptions, ...customFieldOptions];
    } else {
      console.warn("No fields found in the response.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
};
