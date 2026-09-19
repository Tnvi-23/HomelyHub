import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

export const getPropertyDetails = (id) => async (dispatch) => {
  try {
    dispatch(propertyDetailsAction.getListRequest());

    const response = await axiosInstance.get(
      `/v1/rent/listing/${id}`
    );

    console.log("Property API response:", response.data);

    if (!response.data) {
      throw new Error("Could not fetch property details");
    }

    const property = response.data.data;

    if (!property) {
      throw new Error("Property not found");
    }

    dispatch(
      propertyDetailsAction.getPropertyDetails(property)
    );
  } catch (err) {
    console.error(
      "Property details error:",
      err.response?.data || err.message
    );

    dispatch(
      propertyDetailsAction.getErrors(
        err.response?.data?.message ||
          err.message ||
          "Could not fetch property details"
      )
    );
  }
};