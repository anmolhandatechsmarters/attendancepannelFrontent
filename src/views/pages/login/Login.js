import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import Bear from "../../../assets/Login.riv";
const stateMachineName = "Login Machine";
import { startAuthentication } from "@simplewebauthn/browser";
import LOGO from "../../../assets/SmarterLogo.png";
import getSwalTheme from "../../../utils/Swaltheme";
import { RequestFCMToken } from "../../../FirebaseUtils/Firebase";

const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const getroles = localStorage.getItem("role");
  const Swal = getSwalTheme();
  const [userAgent, setUserAgent] = useState("");
  const [ip, setIpAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorr, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeylogin, setPasskeyLogin] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: Bear,
    stateMachines: stateMachineName,
    autoplay: true,
    transparent: true,
  });
  const isChecking = useStateMachineInput(rive, stateMachineName, "isChecking");
  const isHandsUp = useStateMachineInput(rive, stateMachineName, "isHandsUp");
  const numLook = useStateMachineInput(rive, stateMachineName, "numLook");
  const trigSuccess = useStateMachineInput(
    rive,
    stateMachineName,
    "trigSuccess"
  );
  const trigFail = useStateMachineInput(rive, stateMachineName, "trigFail");

  useEffect(() => {
    setUserAgent(navigator.userAgent);
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError("Email and password are required");
      if (trigFail) trigFail.fire();
      return;
    }

    setLoading(true);
    const fcmtoken = await RequestFCMToken();
    try {
      const result = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/user/login`,
        { email, password, fcmtoken },
        {
          params: { ip, userAgent },
          headers: { "Content-Type": "application/json" },
        }
      );
      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.user.role);
        localStorage.setItem("id", result.data.user.id);
        localStorage.setItem("expirytime", result.data.expiryTime);
        localStorage.setItem("refreshtoken", result.data.refreshtoken);
      } else {
        setError(result.data.message);
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      if (trigFail) trigFail.fire();
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFocus = () => {
    if (isChecking) isChecking.value = true;
  };

  const handleEmailBlur = () => {
    if (isChecking) isChecking.value = false;
  };

  const handlePasswordFocus = () => {
    if (isHandsUp) isHandsUp.value = true;
  };

  const handlePasswordBlur = () => {
    if (isHandsUp) isHandsUp.value = false;
  };

  const handlePasskey = async (event) => {
    setPassword("");
    event.preventDefault();
    const rpID = window.location.hostname;
    const origin = window.location.origin;
    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/api/passkey/startlogin`,
        { email, rpID },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("hello2", response.data);

      const loginOptions = response.data;
      trigSuccess.fire();
      // Pass the options to the authenticator and wait for a response
      const asseResp = await startAuthentication({ optionsJSON: loginOptions });
      const fcmtoken = await RequestFCMToken();
      const VerfiycationAuthenticationResponse = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/api/passkey/verifylogin`,
        { email, asseResp, origin, rpID, fcmtoken, ip, userAgent },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = VerfiycationAuthenticationResponse;
      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.user.role);
        localStorage.setItem("id", result.data.user.id);
        localStorage.setItem("expirytime", result.data.expiryTime);
        const getroles = localStorage.getItem("role");
        if (getroles == "Admin") {
          navigate("/dashboard");
        } else if (getroles == "HR") {
          navigate("/hrdetail");
        } else if (getroles == "Employee") {
          navigate("/employeedetail");
        }
      } else {
        setError(result.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        JSON.stringify(error);

      // Suppress specific known message
      if (
        message.includes("The operation either timed out or was not allowed")
      ) {
        return; // silently ignore
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    }
  };

  const handleOtherWaytoLogin = () => {
    Swal.fire({
      title: "You Have This options",
      showDenyButton: true,
      confirmButtonText: "Login With Passkey",
      denyButtonText: `Login With Password`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setPasskeyLogin(true);
      }
      if (result.isDenied) {
        setPasskeyLogin(false);
      }
    });
  };
  useEffect(() => {
    if (token) {
      if (getroles === "Admin") {
        navigate("/dashboard");
      } else if (getroles === "HR") {
        navigate("/hrdetail");
      } else if (getroles === "Employee") {
        navigate("/employeedetail");
      }
    }
  }, [token, getroles, navigate]);
  return (
    <>
      <div className="login-container">
        {/* Left side - Branding/Image */}
        <div className="brand-side">
          <img src={LOGO} alt="Company Logo" className="logo" />
          <h1>Smarters AIM Panel</h1>
        </div>

        {/* Right side - Login Form */}
        <div className="form-side">
          <div className="form-container">
            <div className="rive-wrapper">
              <div className="rive-circle">
                <RiveComponent className="rive-inner" />
              </div>
            </div>
            <h2 className="MobileLabel">Smarters AIM Panel</h2>
            <h2 className="RemoveMobile">Welcome Back</h2>

            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="youremail321@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                />
              </div>
              {passkeylogin ? (
                ""
              ) : (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="********"
                    autoComplete="current-password"
                    value={password}
                    onFocus={handlePasswordFocus} // Triggers Hands Up animation
                    onBlur={handlePasswordBlur}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {/* <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  autoComplete="current-password"
                  value={password}
                  onFocus={handlePasswordFocus} // Triggers Hands Up animation
                  onBlur={handlePasswordBlur}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div> */}

              <div className="form-options">
                <label onClick={handleOtherWaytoLogin}>
                  Try to another way
                </label>
                {/* <a href="#" className="recovery-link">
                  Recovery Password
                </a> */}
              </div>
              {passkeylogin ? (
                <button onClick={handlePasskey} className="login-btn">
                  Login with Passkey
                </button>
              ) : (
                <button onClick={handleSubmit} className="login-btn">
                  Login
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
