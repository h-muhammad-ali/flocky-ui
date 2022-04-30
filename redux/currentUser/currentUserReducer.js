import { SET_CURRENT_USER_JWT } from "./currentUserTypes";

const initialState = {
  jwt: 0,
};

const currentUserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER_JWT:
      return {
        ...state,
        jwt: payload,
      };
    default:
      return state;
  }
};

export default currentUserReducer;
