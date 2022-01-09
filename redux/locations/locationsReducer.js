import {
  SET_SOURCE,
  SET_DESTINATION,
  SET_WAYPOINT,
  REMOVE_WAYPOINT,
  EMPTY_WAYPOINTS,
  EMPTY_SOURCE,
  EMPTY_DESTINATION,
} from "./locationsTypes";

const initialState = {
  source: "",
  destination: "",
  wayPoints: [],
};

const locationsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SOURCE:
      return {
        ...state,
        source: payload,
      };
    case SET_DESTINATION:
      return {
        ...state,
        destination: payload,
      };
    case SET_WAYPOINT:
      return {
        ...state,
        wayPoints: [...state?.wayPoints, payload],
      };
    case REMOVE_WAYPOINT:
      return {
        ...state,
        wayPoints: state?.wayPoints?.filter((item) => item !== payload),
      };
    case EMPTY_WAYPOINTS:
      return {
        ...state,
        wayPoints: [],
      };
    case EMPTY_SOURCE:
      return {
        ...state,
        source: "",
      };
    case EMPTY_DESTINATION:
      return {
        ...state,
        destination: "",
      };

    default:
      return state;
  }
};

export default locationsReducer;
