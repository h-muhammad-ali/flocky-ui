import {
  SET_SOURCE,
  SET_DESTINATION,
  SET_WAYPOINT,
  REMOVE_WAYPOINT,
  EMPTY_WAYPOINTS,
  EMPTY_SOURCE,
  EMPTY_DESTINATION,
  SET_OVERVIEW_POLYLINE,
  RESET_LOCATION_STATE,
} from "./locationsTypes";

export const setSource = (source) => ({
  type: SET_SOURCE,
  payload: source,
});

export const setDestination = (destination) => ({
  type: SET_DESTINATION,
  payload: destination,
});

export const setWayPoint = (wayPoint) => ({
  type: SET_WAYPOINT,
  payload: wayPoint,
});

export const removeWayPoint = (place_id) => ({
  type: REMOVE_WAYPOINT,
  payload: place_id,
});

export const emptyWayPoints = () => ({
  type: EMPTY_WAYPOINTS,
});

export const emptySource = () => ({
  type: EMPTY_SOURCE,
});

export const emptyDestination = () => ({
  type: EMPTY_DESTINATION,
});

export const setOverViewPolyline = (overview_polyline) => ({
  type: SET_OVERVIEW_POLYLINE,
  payload: overview_polyline,
});

export const resetLocationState = () => ({
  type: RESET_LOCATION_STATE,
});
