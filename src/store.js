import { legacy_createStore as createStore } from "redux";

const initialState = {
  sidebarShow: true,
  theme: "light",
  ipAddress: null, // Add property for IP address
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    case "setIpAddress":
      return { ...state, ipAddress: rest.ipAddress };
    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
