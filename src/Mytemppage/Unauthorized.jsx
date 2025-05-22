import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const removelocalsystem = async () => {
      await Swal.fire({
        title: "Unauthorized Access",
        text: "You have been logged out due to unauthorized access.",
        icon: "warning",
        confirmButtonText: "Okay",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      navigate("/login");
    };

    removelocalsystem();
  }, [navigate]);

  return <></>;
};

export default UnauthorizedPage;
