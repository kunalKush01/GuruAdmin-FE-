import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input } from "reactstrap";
import styled from "styled-components";

const LocationWaraper = styled.div`
  input::placeholder {
    color: #583703 !important;
    opacity: 60% !important;
    font: normal normal bold 13px/20px Noto Sans !important;
  }
  input {
    color: #583703 !important;
    border: none !important;
    background-color: #fff7e8 !important;
    font: normal normal normal 13px/20px Noto Sans;
    border-radius: 20px;
  }
  /* map css */
  .autocomplete-dropdown-container {
    border: none;
    background-color: #fff7e8 !important;
    z-index: 100;
    border-radius: 3px;
    margin-top: 2px;
    width: 100%;
    max-height:150px;
    overflow-y: scroll;
    position: absolute;
    /* padding: 1rem; */
    font: normal normal bold 13px/20px noto sans;
    box-shadow: 2px 4px 14px 0 rgba(34, 41, 47, 0.4);
    ::focus {
      background-color: #fff7e8 !important;
    }
    ::-webkit-scrollbar{
      display: none;
    }
  }
  .suggestion-item{
    border: none;
    background-color: #fff7e8 !important;
    box-shadow: none;
    :hover {
      border: none !important;
    }
  }
`;

const CustomLocationField = (props) => {
  console.log("props", props);
  const handleChange = (address) => {
    console.log("address", address);
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
      console.log("results", results);
      console.log(
        getCity(results[0].address_components),
        // getArea(results[0].address_components),
        getState(results[0].address_components)
        // getCountry(results[0].address_components),
        // getPostalCode(results[0].address_components)
      );

      getLatLng(results[0])
        .then((latLng) => {
          props.setFieldValue("location", results[0].formatted_address);
          props.setFieldValue(
            "City",
            getCity(results[0].address_components) || ""
          );
          props.setFieldValue(
            "State",
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
          props.setFieldValue("longitude", latLng.lat);
          props.setFieldValue("latitude", latLng.lng);
          //   this.setState({
          //     address: results[0].formatted_address,
          //     city: getCity(results[0].address_components) || "",
          //     state: getState(results[0].address_components) || "",
          //     country: getCountry(results[0].address_components) || "",
          //     postal_code: getPostalCode(results[0].address_components) || "",
          //     lat: latLng.lat,
          //     lng: latLng.lng,
          //   });
          console.log("Success", latLng);
        })
        .catch((error) => console.error("Error", error));
    });
  };

  return (
    <LocationWaraper>
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
    </LocationWaraper>
  );
};

export default CustomLocationField;
