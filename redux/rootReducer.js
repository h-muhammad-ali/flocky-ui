import { combineReducers } from "redux";
import locationsReducer from "./locations/locationsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import internetStatusReducer from "./internetStatus/internetStatusReducer";
import rideReducer from "./ride/rideReducer";
import companyLocationReducer from "../redux/companyLocation/companyLocationReducer";

const rootReducer = combineReducers({
  locations: locationsReducer,
  currentUser: currentUserReducer,
  internetStatus: internetStatusReducer,
  ride: rideReducer,
  companyLocation: companyLocationReducer,
});

export default rootReducer;
