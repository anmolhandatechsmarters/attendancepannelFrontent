import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { motion } from "framer-motion";
import "./ShowMessage.css";
import vid from "../../assets/vid.mp4";
import { useSelector } from "react-redux";
const ShowMessage = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const popupRef = useRef(null);
  const userId = localStorage.getItem("id");
  const logid = localStorage.getItem("id");
  const [logip, setIpAddress] = useState("");
  const theme = useSelector((state) => state.theme);
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
    const showMessageData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_BASE_URL}/api/message/showmessage/${userId}`
        );
        setMessages(response.data);
        if (response.data.length === 0) handleClose();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    showMessageData();
  }, [userId]);

  useEffect(() => {
    if (!loading && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [loading]);

  const handleClose = () => {
    localStorage.setItem("islogin", true);
    onClose(false);
  };

  const handleMarkMessage = async (mid) => {
    try {
      await axios.put(
        `${import.meta.env.REACT_APP_BASE_URL}/api/message/markmessage/${mid}`,
        { userid: userId, logid, logip },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessages((prev) => prev.filter((msg) => msg.id !== mid));
      localStorage.setItem("event", JSON.stringify([mid]));
      if (currentMessageIndex >= messages.length - 1) handleClose();
      else setCurrentMessageIndex((i) => i + 1);
    } catch (error) {
      console.log("Error marking message:", error);
    }
  };

  const currentMessage = messages[currentMessageIndex];

  return loading ? (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  ) : (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <div className="message-overlay">
        <div ref={popupRef} className="message-popup">
          {currentMessage ? (
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentMessage.bgimage ? (
                <div className="bg-image-container">
                  <img
                    src={`${import.meta.env.REACT_APP_BASE_URL}/${currentMessage.bgimage}`}
                    alt="Background"
                    className="background-image"
                  />
                  <div className="overlay-content">
                    <h3 className="message-title">{currentMessage.title}</h3>
                    <p className="message-description">
                      {currentMessage.description}
                    </p>
                    <div className="button-group">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMarkMessage(currentMessage.id)}
                        className="action-button"
                      >
                        Don't show again
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (currentMessageIndex < messages.length - 1)
                            setCurrentMessageIndex((i) => i + 1);
                          else handleClose();
                        }}
                        className="action-button"
                      >
                        {currentMessageIndex < messages.length - 1
                          ? "Next"
                          : "Close"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message-video-container">
                  <video className="background-video" autoPlay loop muted>
                    <source src={vid} type="video/mp4" />
                  </video>
                  <div className="overlay-content">
                    <img
                      src={`${import.meta.env.REACT_APP_BASE_URL}/${currentMessage.image}`}
                      alt={currentMessage.title}
                      className="message-image"
                    />
                    <h3 className="message-title">{currentMessage.title}</h3>
                    <p className="message-description">
                      {currentMessage.description}
                    </p>
                    <div className="button-group">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMarkMessage(currentMessage.id)}
                        className="action-button"
                      >
                        Don't show again
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (currentMessageIndex < messages.length - 1)
                            setCurrentMessageIndex((i) => i + 1);
                          else handleClose();
                        }}
                        className="action-button"
                      >
                        {currentMessageIndex < messages.length - 1
                          ? "Next"
                          : "Close"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowMessage;
