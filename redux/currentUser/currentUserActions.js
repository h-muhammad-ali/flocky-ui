import {
  SET_CURRENT_USER_JWT,
  SET_CURRENT_USER_IMG_URL,
  SET_CURRENT_USER_NAME,
  RESET_CURRENT_USER,
} from "./currentUserTypes";

export const setCurrentUserJWT = (jwt) => ({
  type: SET_CURRENT_USER_JWT,
  payload: jwt,
});

export const setCurrentUserImageURL = (imgURL) => ({
  type: SET_CURRENT_USER_IMG_URL,
  payload: imgURL,
});

export const setCurrentUserName = (name) => ({
  type: SET_CURRENT_USER_NAME,
  payload: name,
});

export const resetCurrentUser = () => ({
  type: RESET_CURRENT_USER,
});
