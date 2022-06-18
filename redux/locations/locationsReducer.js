import {
  SET_SOURCE,
  SET_DESTINATION,
  SET_WAYPOINT,
  REMOVE_WAYPOINT,
  EMPTY_WAYPOINTS,
  EMPTY_SOURCE,
  EMPTY_DESTINATION,
  SET_OVERVIEW_POLYLINE,
  CLEAR_OVERVIEW_POLYLINE,
  RESET_LOCATION_STATE,
} from "./locationsTypes";

const initialState = {
  source: null,
  destination: null,
  wayPoints: [],
  overview_polyline: "",
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
        wayPoints: state?.wayPoints?.filter(
          (item) => item?.place_id !== payload
        ),
      };
    case EMPTY_WAYPOINTS:
      return {
        ...state,
        wayPoints: [],
      };
    case EMPTY_SOURCE:
      return {
        ...state,
        source: null,
      };
    case EMPTY_DESTINATION:
      return {
        ...state,
        destination: null,
      };
    case SET_OVERVIEW_POLYLINE:
      return {
        ...state,
        overview_polyline: payload,
      };
    case CLEAR_OVERVIEW_POLYLINE:
      return {
        ...state,
        overview_polyline: null,
      };
    case RESET_LOCATION_STATE:
      return {
        source: null,
        destination: null,
        wayPoints: [],
        overview_polyline: "",
      };
    default:
      return state;
  }
};

export default locationsReducer;
