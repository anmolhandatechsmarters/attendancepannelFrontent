import { useEffect, useState } from "react";
import axiosInstance from "../../components/utils/AxiosIntance";
import getSwalTheme from "../../utils/Swaltheme";
import Spinner from "../../utils/Spinner";
import axios from "axios";
const InventoryShow = ({ userid }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Swal = getSwalTheme();
  const [logip, setIpAddress] = useState("");
  const logid = localStorage.getItem("id");
  useEffect(() => {
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

  useEffect(() => {
    if (!userid) return;

    const FetchAssignInventory = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/inventory/getassigninventory/${userid}`
        );
        console.log(userid);
        if (response.data.success) {
          setInventoryData(response.data.data);
          setError(null);
        } else {
          setInventoryData([]);
          setError("No inventory items found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Error fetching inventory data.");
      } finally {
        setLoading(false);
      }
    };

    FetchAssignInventory();
  }, [userid]);

  const handleDelete = async (empid, id) => {
    try {
      // Show a confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Make the API call to delete the item
        const response = await axiosInstance.delete(
          `/api/inventory/deleteassigninventory/${empid}/${id}`,
          {
            params: {
              logid,
              logip,
            },
          }
        );

        if (response.data.success) {
          // Update the state to remove the item from the UI
          setInventoryData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );

          // Show a success message
          Swal.fire("Deleted!", "The item has been deleted.", "success");
        } else {
          // Show an error message if the delete was unsuccessful
          Swal.fire(
            "Error!",
            response.data.message || "Failed to delete the item.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);

      // Show an error message if the API call failed
      Swal.fire(
        "Error!",
        "An error occurred while deleting the item.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Assigned Inventory for User {userid}
      </h2>
      {inventoryData && inventoryData.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {inventoryData.map((card) => (
            <div
              key={card.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "200px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "transform 0.2s",
                backgroundColor: "#fff",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{ padding: "15px", textAlign: "center" }}>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {card.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    color: "#777",
                  }}
                >
                  {card.description || "No description available."}
                </p>
              </div>
              <button
                onClick={() => handleDelete(userid, card.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "red",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                &#x2715;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>
          No inventory items found for this user.
        </p>
      )}
    </div>
  );
};

export default InventoryShow;
