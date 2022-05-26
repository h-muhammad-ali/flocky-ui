import { CONNECTION_STATUS_CHANGED } from "./internetStatusTypes";
import NetInfo from "@react-native-community/netinfo";

let unsubscribe;

export const connectionStatusChanged = (status) => ({
  type: CONNECTION_STATUS_CHANGED,
  payload: status,
});

export const registerNetworkStatusListener = () => (dispatch) => {
  unsubscribe = NetInfo.addEventListener((connectionInfo) => {
    dispatch(connectionChanged(connectionInfo));
  });
};

export const unregisterNetworkStatusListeners = () => (dispatch) => {
  unsubscribe && unsubscribe();
};

export const connectionChanged = (connectionInfo) => (dispatch) => {
  dispatch(connectionStatusChanged(connectionInfo?.isConnected));
};
