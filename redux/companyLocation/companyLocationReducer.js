import { SET_COMPANY_LOCATION } from "./companyLocationTypes";

const initialState = {
  location: null,
};

const companyLocationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_COMPANY_LOCATION:
      return {
        ...state,
        location: payload,
      };
    default:
      return state;
  }
};

export default companyLocationReducer;
