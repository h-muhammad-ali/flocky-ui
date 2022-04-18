import { SET_CURRENT_USER_ID } from "./currentUserTypes";

const initialState = {
  id: 0,
};

const currentUserReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER_ID:
      return {
        ...state,
        id: payload,
      };
    default:
      return state;
  }
};

export default currentUserReducer;
