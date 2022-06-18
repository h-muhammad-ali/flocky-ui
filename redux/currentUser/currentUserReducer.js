import {
  SET_CURRENT_USER_JWT,
  SET_CURRENT_USER_IMG_URL,
  SET_CURRENT_USER_NAME,
  RESET_CURRENT_USER,
} from "./currentUserTypes";

const initialState = {
  jwt: null,
  imageURL: null,
  userName: null,
};

const currentUserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER_JWT:
      return {
        ...state,
        jwt: payload,
      };
    case SET_CURRENT_USER_IMG_URL:
      return {
        ...state,
        imageURL: payload,
      };
    case SET_CURRENT_USER_NAME:
      return {
        ...state,
        userName: payload,
      };
    case RESET_CURRENT_USER:
      return {
        jwt: null,
        imageURL: null,
        userName: null,
        companyName: null,
        peopleCount: 0,
      };
    default:
      return state;
  }
};

export default currentUserReducer;
