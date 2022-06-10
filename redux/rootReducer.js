import { combineReducers } from "redux";
import locationsReducer from "./locations/locationsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import internetStatusReducer from "./internetStatus/internetStatusReducer";
import rideReducer from "./ride/rideReducer";

const rootReducer = combineReducers({
  locations: locationsReducer,
  currentUser: currentUserReducer,
  internetStatus: internetStatusReducer,
  ride: rideReducer,
});

export default rootReducer;
