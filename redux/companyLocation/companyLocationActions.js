import { SET_COMPANY_LOCATION } from "./companyLocationTypes";

export const setCompanyLocation = (loc) => ({
  type: SET_COMPANY_LOCATION,
  payload: loc,
});
