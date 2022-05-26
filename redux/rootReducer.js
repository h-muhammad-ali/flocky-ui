import { combineReducers } from "redux";
import locationsReducer from "./locations/locationsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import internetStatusReducer from "./internetStatus/internetStatusReducer";

const rootReducer = combineReducers({
  locations: locationsReducer,
  currentUser: currentUserReducer,
  internetStatus: internetStatusReducer,
});

export default rootReducer;
