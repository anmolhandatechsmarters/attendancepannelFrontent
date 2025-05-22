// store.js or your redux store file
import { legacy_createStore as createStore } from "redux";
const savedTheme = localStorage.getItem("paneltheme") || "light";

const initialState = {
  sidebarShow: true,
  theme: savedTheme,
  ipAddress: null,
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
