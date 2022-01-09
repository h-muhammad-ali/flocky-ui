import {
  SET_SOURCE,
  SET_DESTINATION,
  SET_WAYPOINT,
  REMOVE_WAYPOINT,
  EMPTY_WAYPOINTS,
  EMPTY_SOURCE,
  EMPTY_DESTINATION,
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

export const removeWayPoint = (wayPoint) => ({
  type: REMOVE_WAYPOINT,
  payload: wayPoint,
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
