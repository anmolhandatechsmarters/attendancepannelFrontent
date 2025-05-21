import Swal from "sweetalert2";
import store from "../store"

const getSwalTheme = () => {
  const state = store.getState();
  const isDark = state.theme === "dark";
  return Swal.mixin({
    background: isDark ? "black" : "#ffffff",
    color: isDark ? "#ffffff" : "#000000",
    iconColor: "#6360FF",
    confirmButtonColor: "#6360FF",
  });
};

export default getSwalTheme;
