import React, { useEffect, useState } from "react";
import axios from "axios";
import { startRegistration } from "@simplewebauthn/browser";
const PasskeyRegisteration = () => {
  const [userid, setuserid] = useState("");
  useEffect(() => {
    const localid = localStorage.getItem("id");
    setuserid(localid);
  });
  console.log(userid);

  // base 64 data converted

  const RegisterPasskey = async () => {
    try {
      const rpID = window.location.hostname;
      const origin = window.location.origin;
      const response = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/api/passkey/registerpasskey/${userid}`, // ✅ Send userid in the URL
        { rpID }, // No request body needed
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const passkeyData = response.data;

      const attResp = await startRegistration({ optionsJSON: passkeyData });

      // const assertion = await navigator.credentials.get(
      //   attResp
      // );
      // if (assertion) {
      //   alert("Passkey already exists on this device.");
      //   return;
      // }

      const verificationResp = await axios.post(
        `${import.meta.env.REACT_APP_BASE_URL}/api/passkey/verifyregistration`,
        { userId: userid, credential: attResp, origin, rpID },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("verificationResp", verificationResp);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="setting-item">
        <span>Passkey Registration</span>
        <button id="Commonbutton" onClick={RegisterPasskey}>
          Register
        </button>
      </div>
    </div>
  );
};

export default PasskeyRegisteration;
