import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input } from "reactstrap";
import "../../assets/scss/common.scss";

const CustomFieldLocationForDonationUser = (props) => {
  const handleChange = (address) => {
    if (props.type === "home") {
      props.setFieldValue("homeLocation", address);
    } else if (props.type === "correspondence") {
      props.setFieldValue("correspondenceLocation", address);
    } else {
      props.setFieldValue("location", address);
    }
  };

  const getCity = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("postal_town")) {
        if (
          props.values.searchType === "isGoogleMap" ||
          props.values.correspondenceSearchType === "isCorrespondenceGoogleMap"
        ) {
          return {
            name: addressArray[i].long_name,
            id: addressArray[i].short_name,
          };
        }
        return addressArray[i].long_name;
      } else if (
        addressArray[i].types.includes("administrative_area_level_2")
      ) {
        if (
          props.values.searchType === "isGoogleMap" ||
          props.values.correspondenceSearchType === "isCorrespondenceGoogleMap"
        ) {
          return {
            name: addressArray[i].long_name,
            id: addressArray[i].short_name,
          };
        }
        return addressArray[i].long_name;
      }
    }
    if (
      props.values.searchType === "isGoogleMap" ||
      props.values.correspondenceSearchType === "isCorrespondenceGoogleMap"
    ) {
      return "";
    }
    return "";
  };
  const getState = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("administrative_area_level_1")) {
        if (
          props.values.searchType === "isGoogleMap" ||
          props.values.correspondenceSearchType === "isCorrespondenceGoogleMap"
        ) {
          return {
            name: addressArray[i].long_name,
            id: addressArray[i].short_name,
          };
        }
        return addressArray[i].long_name;
      }
    }

    if (
      props.values.searchType === "isGoogleMap" ||
      props.values.correspondenceSearchType === "isCorrespondenceGoogleMap"
    ) {
      return "";
    }
    return "";
  };

  const getCountry = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("country")) {
        return {
          name: addressArray[i].long_name,
          id: addressArray[i].short_name, // Using short_name as ID for example
        };
      }
    }
    return "";
  };

  const getPostalCode = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("postal_code")) {
        return {
          name: addressArray[i].long_name,
          id: addressArray[i].short_name, // Using short_name as ID for example
        };
      }
    }
    return "";
  };
  const getDistrict = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("administrative_area_level_2")) {
        return addressArray[i].long_name;
      }
    }
    return "";
  };
  const handleSelect = (address) => {
    geocodeByAddress(address).then((results) => {
      getLatLng(results[0])
        .then((latLng) => {
          if (props.type === "home") {
            props.setFieldValue("homeLocation", results[0].formatted_address);
            props.setFieldValue(
              "city",
              getCity(results[0].address_components) || ""
            );
            props.setFieldValue(
              "state",
              getState(results[0].address_components) || ""
            );
            props.setFieldValue(
              "country",
              getCountry(results[0].address_components) || ""
            );
            props.setFieldValue(
              "pin",
              getPostalCode(results[0].address_components) || ""
            );
            props.setFieldValue(
              "district",
              getDistrict(results[0].address_components) || ""
            );
          } else if (props.type === "correspondence") {
            props.setFieldValue(
              "correspondenceLocation",
              results[0].formatted_address
            );
            props.setFieldValue(
              "correspondenceCity",
              getCity(results[0].address_components) || ""
            );
            props.setFieldValue(
              "correspondenceState",
              getState(results[0].address_components) || ""
            );
            props.setFieldValue(
              "correspondenceCountry",
              getCountry(results[0].address_components) || ""
            );
            props.setFieldValue(
              "correspondencePin",
              getPostalCode(results[0].address_components) || ""
            );
            props.setFieldValue(
              "correspondenceDistrict",
              getDistrict(results[0].address_components) || ""
            );
          } else {
            props.setFieldValue("location", results[0].formatted_address);
            props.setFieldValue(
              "city",
              getCity(results[0].address_components) || ""
            );
            props.setFieldValue(
              "state",
              getState(results[0].address_components) || ""
            );
            props.setFieldValue(
              "country",
              getCountry(results[0].address_components) || ""
            );
            props.setFieldValue(
              "pin",
              getPostalCode(results[0].address_components) || ""
            );
            props.setFieldValue(
              "district",
              getDistrict(results[0].address_components) || ""
            );
          }
          props.setFieldValue("longitude", latLng.lng);
          props.setFieldValue("latitude", latLng.lat);
        })
        .catch((error) => console.error("Error", error));
    });
  };

  return (
    <div className="locationwrapper">
      <PlacesAutocomplete
        value={
          props?.values?.location || props?.values[`${props.type}Location`]
        }
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={{
          strictbounds: ["address"],
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="locationField w-100 position-relative">
            <Input
              className="w-100 "
              {...getInputProps({
                placeholder: "Search Places ...",
                disabled: props.disabled,
                name: `${props.type}Location`,
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions?.map((suggestion) => {
                const className = suggestion?.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {
                      backgroundColor: "#ff8744",
                      color: "#fff",
                      padding: "5px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      borderRadius: "3px",
                      padding: "5px",
                      cursor: "pointer",
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion?.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default CustomFieldLocationForDonationUser;
