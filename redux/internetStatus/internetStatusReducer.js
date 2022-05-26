import { CONNECTION_STATUS_CHANGED } from "./internetStatusTypes";

const initialState = {
  connectionStatus: false,
};

const internetStatusReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CONNECTION_STATUS_CHANGED:
      return {
        ...state,
        connectionStatus: payload,
      };
    default:
      return state;
  }
};

export default internetStatusReducer;
