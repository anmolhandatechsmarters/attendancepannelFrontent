import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useColorModes } from "@coreui/react";
import "./scss/style.scss";
import { useDispatch } from "react-redux";
// import Admin from "./Mytemppage/Admin";
import PrivateRoute from "./privatePages/Privaterouting";
import UnauthorizedPage from "./privatePages/Unauthorized";
import Forgetpassword from "./views/pages/ForgetPasswordlogin/Forgetpassword";
import Confirmpassword from "./views/pages/ForgetPasswordlogin/Confirmpassword";
import DefaultLayout from "./layout/DefaultLayout";
import HRLayout from "./layout/HRLayout";
import { RequestFCMToken } from "./FirebaseUtils/Firebase";
import { fetchAndSetIp } from "./utils/fetchAndSetIp";
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const EmployeeLayout = React.lazy(() => import("./layout/Employeelayout"));

const App = () => {
  const dispatch = useDispatch();
  const { isColorModeSet, setColorMode } = useColorModes("paneltheme");
  const storedTheme = useSelector((state) => state.theme);
  const [fcmToken, setfcmToken] = useState(null);

  useEffect(() => {
    const fectchFcMtoken = async () => {
      const fcmtoken = await RequestFCMToken();
      setfcmToken(fcmtoken);
    };
    fectchFcMtoken();
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("theme")?.match(/^[A-Za-z0-9\s]+/)?.[0];

    const storedTheme = localStorage.getItem("paneltheme") || "light";

    const finalTheme = theme || storedTheme;
    localStorage.setItem("paneltheme", finalTheme);
    document.body.classList.toggle("dark", finalTheme === "dark");
    dispatch({ type: "set", theme: finalTheme });
  }, [dispatch]);

  useEffect(() => {
    const theme = localStorage.getItem("paneltheme") || "light";
    document.body.classList.toggle("dark", theme === "dark");
  }, []);

  useEffect(() => {
    fetchAndSetIp(); // Fetch IP only once when app loads
  }, []);

  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="*" name="default" element={<DefaultLayout />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/" name="Login Page" element={<Login />} />
          <Route path="/build" name="Login Page" element={<Login />} />
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route
            path="/forgetpassword"
            name="Forget Password"
            element={<Forgetpassword />}
          />
          <Route path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="/user/employee"
            element={
              <PrivateRoute
                element={EmployeeLayout}
                allowedRoles={["Employee"]}
              />
            }
          />
          {/* <Route
            path="/user/hr"
            element={<PrivateRoute element={HRLayout} allowedRoles={["HR"]} />}
          /> */}
          {/* <Route
            path="/user/admin"
            element={<PrivateRoute element={Admin} allowedRoles={["Admin"]} />}
          /> */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/confirmpassword"
            name="Confirm Password"
            element={<Confirmpassword />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
