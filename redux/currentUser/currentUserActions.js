import { SET_CURRENT_USER_ID } from "./currentUserTypes";

export const setCurrentUserID = (id) => ({
  type: SET_CURRENT_USER_ID,
  payload: id,
});
