import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["currentUser"],
};
const pReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(logger, thunk))
);
export const persistor = persistStore(store);

export default store;
