import {
  SET_RIDE_ID,
  CLEAR_RIDE_ID,
  SET_ROLE,
  CLEAR_ROLE,
  SET_RIDE_IN_PROGRESS,
  CLEAR_RIDE_STATUS,
  SET_RIDE_IN_WAITING,
} from "./rideTypes";

export const setRideID = (rideID) => ({
  type: SET_RIDE_ID,
  payload: rideID,
});

export const clearRideID = () => ({
  type: CLEAR_RIDE_ID,
});

export const setRole = (role) => ({
  type: SET_ROLE,
  payload: role,
});

export const clearRole = () => ({
  type: CLEAR_ROLE,
});

export const setRideInProgress = () => ({
  type: SET_RIDE_IN_PROGRESS,
});

export const setRideInWaiting = () => ({
  type: SET_RIDE_IN_WAITING,
});

export const clearRideStatus = () => ({
  type: CLEAR_RIDE_STATUS,
});
