import React, { useState, useEffect } from "react";
import "../css/Loadingpage.css";

const LoadingPage = ({ onTimeout }) => {
  const [visible, setVisible] = useState(true); // State to control visibility

  useEffect(() => {
    // Set a timer to hide the loading screen
    const timer = setTimeout(() => {
      setVisible(false);
      if (onTimeout) onTimeout(); // Trigger callback after timeout, if provided
    }, 3000); // 3000ms = 3 seconds

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [onTimeout]);

  // Don't render anything if loading is not visible
  if (!visible) return null;

  return (
    <div className="loading-wrapper">
      <div className="loading-spinner"></div>
      <h2 className="loading-text">Loading, please wait...</h2>
    </div>
  );
};

export default LoadingPage;
