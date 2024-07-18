import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input } from "reactstrap";
import styled from "styled-components";
import '../../../src/styles/common.scss';

const LocationWaraper = styled.div``;
;

const CustomLocationField = (props) => {
  const handleChange = (address) => {
    props.setFieldValue("location", address);
    // this.setState({ address });
  };

  const getCity = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("postal_town")) {
        return addressArray[i].long_name;
      } else if (
        addressArray[i].types.includes("administrative_area_level_2")
      ) {
        return addressArray[i].long_name;
      }
    }
    return "";
  };
  const getState = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types.includes("administrative_area_level_1")) {
        return addressArray[i].long_name;
      }
    }
    return "";
  };

  const handleSelect = (address) => {
    geocodeByAddress(address).then((results) => {
      getLatLng(results[0])
        .then((latLng) => {
          props.setFieldValue("location", results[0].formatted_address);
          props.setFieldValue(
            "city",
            getCity(results[0].address_components) || ""
          );
          props.setFieldValue(
            "state",
            getState(results[0].address_components) || ""
          );
          // props.setFieldValue(
          //   "user_country",
          //   getCountry(results[0].address_components) || ""
          // );
          // props.setFieldValue(
          //   "user_postal_code",
          //   getPostalCode(results[0].address_components) || ""
          // );
          props.setFieldValue("longitude", latLng.lng);
          props.setFieldValue("latitude", latLng.lat);
          //   this.setState({
          //     address: results[0].formatted_address,
          //     city: getCity(results[0].address_components) || "",
          //     state: getState(results[0].address_components) || "",
          //     country: getCountry(results[0].address_components) || "",
          //     postal_code: getPostalCode(results[0].address_components) || "",
          //     lat: latLng.lat,
          //     lng: latLng.lng,
          //   });
        })
        .catch((error) => console.error("Error", error));
    });
  };

  return (
    <div className="locationwaraper">
      <PlacesAutocomplete
        value={props?.values?.location}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={{
          strictbounds: ["address"],
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="locationField w-100 position-relative">
            <Input
              className="w-100"
              {...getInputProps({
                placeholder: "Search Places ...",
                // className: `location-search-input form-control professional-input-radius ${
                //   props?.errors.location && props?.touched?.location
                //     ? "is-invalid"
                //     : null
                // }`,
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

export default CustomLocationField;
