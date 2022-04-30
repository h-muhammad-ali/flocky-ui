import {
  SET_CURRENT_USER_JWT,
  CLEAR_CURRENT_USER_JWT,
} from "./currentUserTypes";

const initialState = {
  jwt: null,
};

const currentUserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER_JWT:
      return {
        ...state,
        jwt: payload,
      };
    case CLEAR_CURRENT_USER_JWT:
      return {
        ...state,
        jwt: null,
      };
    default:
      return state;
  }
};

export default currentUserReducer;
