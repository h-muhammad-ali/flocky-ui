import {
  SET_RIDE_ID,
  CLEAR_RIDE_ID,
  SET_ROLE,
  CLEAR_ROLE,
  SET_RIDE_IN_PROGRESS,
  CLEAR_RIDE_STATUS,
  SET_RIDE_IN_WAITING,
} from "./rideTypes";

const initialState = {
  rideID: null,
  role: null,
  rideStatus: null,
};

const rideReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_RIDE_ID:
      return {
        ...state,
        rideID: payload,
      };
    case CLEAR_RIDE_ID:
      return {
        ...state,
        rideID: null,
      };
    case SET_ROLE:
      return {
        ...state,
        role: payload,
      };
    case CLEAR_ROLE:
      return {
        ...state,
        role: null,
      };
    case SET_RIDE_IN_PROGRESS:
      return {
        ...state,
        rideStatus: "P",
      };
    case SET_RIDE_IN_WAITING:
      return {
        ...state,
        rideStatus: "W",
      };
    case CLEAR_RIDE_STATUS:
      return {
        ...state,
        rideStatus: null,
      };
    default:
      return state;
  }
};

export default rideReducer;
