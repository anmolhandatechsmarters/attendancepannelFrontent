import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import Bear from "../../../assets/Login2.riv";

const stateMachineName = "Login Machine"; // Make sure this matches exactly

const RiveAnimation = () => {
  // Load Rive animation
  const { rive, RiveComponent } = useRive({
    src: Bear,
    stateMachines: stateMachineName,
    autoplay: true,
  });

  // Log available state machines and inputs
  useEffect(() => {
    if (rive) {
      console.log("Available State Machines:", rive.stateMachineNames);

      if (rive.stateMachineNames.length > 0) {
        const stateMachineName = rive.stateMachineNames[0];
        console.log(`State Machine: ${stateMachineName}`);

        const inputs = rive.stateMachineInputs(stateMachineName);
        console.log(
          "Available Inputs in State Machine:",
          inputs?.map((input) => input.name) || []
        );
      } else {
        console.warn("No state machines found in the Rive file.");
      }
    }
  }, [rive]);

  // Get state machine inputs
  const isChecking = useStateMachineInput(rive, stateMachineName, "isChecking");
  const isHandsUp = useStateMachineInput(rive, stateMachineName, "isHandsUp");
  const numLook = useStateMachineInput(rive, stateMachineName, "numLook");
  const trigSuccess = useStateMachineInput(rive, stateMachineName, "trigSuccess");
  const trigFail = useStateMachineInput(rive, stateMachineName, "trigFail");

  // Handler for email focus (Check animation)
  const handleEmailFocus = () => {
    if (isChecking) isChecking.value = true; // Activate Check animation
  };

  // Handler for email blur (Stop Check animation)
  const handleEmailBlur = () => {
    if (isChecking) isChecking.value = false; // Deactivate Check animation
  };

  // Handler for password focus (Hands Up animation)
  const handlePasswordFocus = () => {
    if (isHandsUp) isHandsUp.value = true; // Activate Hands Up animation
  };

  // Handler for password blur (Lower hands)
  const handlePasswordBlur = () => {
    if (isHandsUp) isHandsUp.value = false; // Deactivate Hands Up animation
  };

  // Simulate Login Success/Failure
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "test@example.com" && password === "password123") {
      if (trigSuccess) trigSuccess.fire(); // Show success animation
    } else {
      if (trigFail) trigFail.fire(); // Show fail animation
    }
  };

  return (
    <div className="login-container">
      {/* Bear Animation */}
      <div className="bear-animation">
        <RiveComponent style={{ height: "300px", width: "300px" }} />
      </div>

      {/* Login Form */}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onFocus={handleEmailFocus} // Triggers Check animation
          onBlur={handleEmailBlur} // Stops Check animation
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onFocus={handlePasswordFocus} // Triggers Hands Up animation
          onBlur={handlePasswordBlur} // Stops Hands Up animation
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default RiveAnimation;
