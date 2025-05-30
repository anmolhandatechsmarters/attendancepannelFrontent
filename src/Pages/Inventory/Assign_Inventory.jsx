import { useEffect, useState } from "react";
import "./assignInventory.css";
import Select from "react-select";
import axiosInstance from "../../components/utils/AxiosIntance";
import getSwalTheme from "../../utils/Swaltheme";
import axios from "axios";
import { MdHelp } from "react-icons/md";
import Spinner from "../../utils/Spinner";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const Assign_Inventory = () => {
const theme = useSelector((state) => state.theme);
  const Swal = getSwalTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [UserOptions, setUserOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [CategoryOptions, setCategoryOptions] = useState([]);
  
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    emp_id: "",
    image: "",
  });
  const [loading, setloading] = useState(true);
  const [categoryData, setCategoryData] = useState({
    images: [],
    name: "",
    description: "",
  });

  const [data, setdata] = useState("");
  const [categorylength, setcategorylength] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [categoryimage, setCategoryimage] = useState("");

  const [selectedCards, setSelectedCards] = useState({});
  const fadeVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#2C353D" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      border: theme === "dark" ? "1px solid #666" : "1px solid #ccc",
      padding: "5px",
      zIndex: 99,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#fff" : "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#aaa" : "#888",
    }),
    input: (provided) => ({
      ...provided,
      color: theme === "dark" ? "#fff" : "#000",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme === "dark"
          ? "#555"
          : "#ddd"
        : theme === "dark"
          ? "#333"
          : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: theme === "dark" ? "#444" : "#f5f5f5",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      zIndex: 999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
  };
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
    async function FetchUserData() {
      try {
        const response = await axiosInstance.get("/api/inventory/getuserdata");
        const formattedData = response.data.data.map((user) => ({
          first_name: user.first_name,
          last_name: user.last_name,
          emp_id: user.emp_id,
        }));

        const data = response.data.data.map((item) => ({
          value: item.id,
          label: `${item.first_name} ${item.last_name}(${item.emp_id})`,
        }));
        setUserOptions(data);
        console.log(formattedData);
        setloading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setloading(false);
      }
    }

    async function FetchCategoryData() {
      try {
        const response = await axiosInstance.get(
          "/api/inventory/getcategorydataselect"
        );
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.category_name,
        }));
        setCategoryOptions(data);
      } catch {}
    }

    FetchUserData();
    FetchCategoryData();
  }, []);

  const handleuser = async (selectedOption) => {
    setSelectedUser(selectedOption);
    const id = selectedOption.value;

    try {
      const response = await axiosInstance.get(
        `/api/inventory/getuserdatabyid/${id}`
      );

      const { first_name, last_name, emp_id, image } = response.data;

      setUserData({
        first_name,
        last_name,
        emp_id,
        image,
      });

      const imageUrl = `${import.meta.env.REACT_APP_BASE_URL}/${image}`;
      console.log("image", imageUrl);
      setImageUrl(imageUrl);

      console.log("User Data:", { first_name, last_name, emp_id, image });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCategory = async (selectCategory) => {
    setSelectedCategory(selectCategory);

    const categoryId = selectCategory.value;
    console.log("Selected Category ID:", categoryId);

    try {
      const response = await axiosInstance.get(
        `/api/inventory/getInvetorydatabycategory/${categoryId}`
      );

      const categoryData = response.data;

      // Assuming response.data contains the relevant category information
      if (Array.isArray(categoryData) && categoryData.length > 0) {
        setCategoryData({
          image: categoryData[0].image,
          name: categoryData[0].name,
          description: categoryData[0].description,
        });

        setCategoryimage(
          `${import.meta.env.REACT_APP_BASE_URL}/${categoryData[0].image}`
        );

        setcategorylength(categoryData); // Set category length based on the fetched data
        setdata(categoryData); // Set the category data as well
      } else {
        setcategorylength([]); // If no data, set an empty array
        setdata([]); // Reset the data
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleCardClick = (categoryId, card) => {
    setSelectedCards((prev) => {
      const selectedInCategory = prev[categoryId] ?? [];
      const updatedCategory = selectedInCategory.some(
        (item) => item.id === card.id
      )
        ? selectedInCategory.filter((item) => item.id !== card.id)
        : [...selectedInCategory, card];

      return prev[categoryId] === updatedCategory
        ? prev
        : { ...prev, [categoryId]: updatedCategory };
    });
  };

  const toggleSelection = (categoryId, card) => {
    setSelectedCards((prev) => {
      const prevState = prev || {}; // Handle case where prev is undefined
      const selectedInCategory = prevState[categoryId] || [];
      const index = selectedInCategory.findIndex((item) => item.id === card.id);

      const newSelected =
        index === -1
          ? [...selectedInCategory, card]
          : selectedInCategory.filter((item) => item.id !== card.id);

      return {
        ...prevState,
        [categoryId]: newSelected,
      };
    });
  };

  const TableRow = ({ item, selectedCards, toggleSelection }) => {
    const isSelected = (selectedCards["currentCategory"] || []).some(
      (selected) => selected.id === item.id
    );
  };
  const handleRowClick = (e) => {
    // Only trigger if the click wasn't on the checkbox itself
    if (!e.target.closest('input[type="checkbox"]')) {
      toggleSelection("currentCategory", item);
    }
  };
  const handleDeselect = (card) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to deselect the item: ${card.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deselect it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedSelectedCards = { ...selectedCards };

        Object.keys(updatedSelectedCards).forEach((categoryId) => {
          updatedSelectedCards[categoryId] = updatedSelectedCards[
            categoryId
          ].filter((selectedCard) => selectedCard.id !== card.id);
        });

        setSelectedCards(updatedSelectedCards);

        Swal.fire(
          "Deselected!",
          `${card.name} has been deselected.`,
          "success"
        );
      }
    });
  };

  const handleAssignInventory = async () => {
    const allCardIds = Object.values(selectedCards)
      .flat()
      .map((card) => card.id);
    console.log("Selected Card IDs:", allCardIds);

    // Validation: Check if no cards are selected
    if (allCardIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "No inventory items selected. Please select at least one item to assign.",
      });
      return; // Stop further execution
    }

    try {
      const response = await axiosInstance.post(
        "/api/inventory/postassigninventory",
        {
          empid: userData.emp_id,
          dataid: allCardIds,
          logid,
          logip,
        }
      );

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message || "Inventory items assigned successfully.",
        timer: 2000, // Auto close after 2 seconds
        showConfirmButton: false,
      });

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error assigning inventory:", error);

      // Error Alert
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while assigning inventory.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const showDescription = (description) => {
    Swal.fire({
      title: "Full Description",
      text: description,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <motion.div
      className="AssignInventoryMaindiv"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
    >
      {/* First Section */}
      <motion.div className="FirstDiv" variants={fadeVariants}>
        <div>
          <label>Select the Employee</label>
          <Select
            classNamePrefix="adminaddinvetory-react-select"
            value={selectedUser}
            onChange={handleuser}
            options={UserOptions}
            placeholder="Select Employee"
            styles={selectStyles}
          />
        </div>

        <hr />

        <div>
          <label>Select the Category</label>
          <Select
            classNamePrefix="adminaddinvetory-react-select"
            value={selectedCategory}
            onChange={handleCategory}
            options={CategoryOptions}
            placeholder="Select Category"
            styles={selectStyles}
          />
        </div>

        <hr />

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categorylength && categorylength.length > 0 ? (
                categorylength.map((item) => {
                  const isSelected =
                    selectedCards["currentCategory"]?.some(
                      (s) => s.id === item.id
                    ) || false;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleCardClick("currentCategory", item)}
                      style={{
                        backgroundColor: isSelected ? "#5856d6" : "transparent",
                        color: isSelected ? "#fff" : "#000",
                      }}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleSelection("currentCategory", item)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>
                        <img
                          src={`${import.meta.env.REACT_APP_BASE_URL}/${item.image}`}
                          alt={item.name}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>
                        {item.description?.length > 20 ? (
                          <>
                            {item.description.slice(0, 20)}...
                            <MdHelp
                              onClick={() => showDescription(item.description)}
                              style={{
                                marginLeft: "5px",
                                color: "#007bff",
                                cursor: "pointer",
                              }}
                            />
                          </>
                        ) : (
                          item.description
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Second Section */}
      <motion.div className="SecondDiv" variants={fadeVariants}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <img
            src={imageUrl}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem",
            }}
          />
          <div>
            <h2>
              {userData.first_name} {userData.last_name}
            </h2>
            <p>{userData.emp_id}</p>
          </div>
        </div>

        {Object.keys(selectedCards).length > 0 && (
          <div className="selected-cards-display">
            <h2>Status</h2>
            <div style={{ overflowX: "auto", maxHeight: "400px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedCards).map(([_, cards]) =>
                    cards.map((card) => (
                      <tr key={card.id}>
                        <td>{card.name}</td>
                        <td>
                          {card.description?.length > 20 ? (
                            <>
                              {card.description.slice(0, 20)}...
                              <MdHelp
                                onClick={() =>
                                  showDescription(card.description)
                                }
                                style={{
                                  marginLeft: "5px",
                                  color: "#007bff",
                                  cursor: "pointer",
                                }}
                              />
                            </>
                          ) : (
                            card.description
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeselect(card)}
                            style={{
                              backgroundColor: "#f44336",
                              color: "#fff",
                              border: "none",
                              borderRadius: "5px",
                              padding: "4px 8px",
                              cursor: "pointer",
                            }}
                          >
                            Deselect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          className="submit-btn"
          id="Commonbutton"
          onClick={handleAssignInventory}
        >
          Assign Inventory
        </button>
      </motion.div>
    </motion.div>
  );
};

const getSelectStyles = () => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    border: theme === "dark" ? "1px solid #666" : "1px solid #ccc",
    zIndex: 99,
    padding: "5px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#fff" : "#000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#aaa" : "#888",
  }),
  input: (provided) => ({
    ...provided,
    color: theme === "dark" ? "#fff" : "#000",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? theme === "dark"
        ? "#555"
        : "#ddd"
      : theme === "dark"
        ? "#333"
        : "#fff",
    color: theme === "dark" ? "#fff" : "#000",
    ":hover": {
      backgroundColor: theme === "dark" ? "#444" : "#f5f5f5",
      color: theme === "dark" ? "#fff" : "#000",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === "dark" ? "#333" : "#fff",
    zIndex: 999,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
  }),
});

export default Assign_Inventory;
