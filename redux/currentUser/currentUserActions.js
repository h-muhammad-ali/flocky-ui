import {
  CLEAR_CURRENT_USER_JWT,
  SET_CURRENT_USER_JWT,
} from "./currentUserTypes";

export const setCurrentUserJWT = (jwt) => ({
  type: SET_CURRENT_USER_JWT,
  payload: jwt,
});

export const clearCurrentUserJWT = () => ({
  type: CLEAR_CURRENT_USER_JWT,
});
