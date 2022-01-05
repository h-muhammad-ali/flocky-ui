import { combineReducers } from "redux";
import locationsReducer from "./locations/locationsReducer";

const rootReducer = combineReducers({
  locations: locationsReducer,
});

export default rootReducer;
