import { combineReducers } from "redux";
import locationsReducer from "./locations/locationsReducer";
import currentUserReducer from "./currentUser/currentUserReducer";

const rootReducer = combineReducers({
  locations: locationsReducer,
  currentUser: currentUserReducer,
});

export default rootReducer;
