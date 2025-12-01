import React, { createContext, useContext, useState, useEffect } from "react";

const LaunchContext = createContext();

export const useLaunch = () => {
  const context = useContext(LaunchContext);
  if (!context) {
    throw new Error("useLaunch must be used within a LaunchProvider");
  }
  return context;
};

export const LaunchProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [selectedType, setSelectedType] = useState(() => {
    const saved = localStorage.getItem("launchly_selectedType");
    return saved ? JSON.parse(saved) : null;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("launchly_formData");
    return saved ? JSON.parse(saved) : null;
  });

  const [generatedContent, setGeneratedContent] = useState(() => {
    const saved = localStorage.getItem("launchly_generatedContent");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (selectedType) {
      localStorage.setItem(
        "launchly_selectedType",
        JSON.stringify(selectedType)
      );
    } else {
      localStorage.removeItem("launchly_selectedType");
    }
  }, [selectedType]);

  useEffect(() => {
    if (formData) {
      localStorage.setItem("launchly_formData", JSON.stringify(formData));
    } else {
      localStorage.removeItem("launchly_formData");
    }
  }, [formData]);

  useEffect(() => {
    if (generatedContent) {
      localStorage.setItem(
        "launchly_generatedContent",
        JSON.stringify(generatedContent)
      );
    } else {
      localStorage.removeItem("launchly_generatedContent");
    }
  }, [generatedContent]);

  const clearState = () => {
    setSelectedType(null);
    setFormData(null);
    setGeneratedContent(null);
    localStorage.removeItem("launchly_selectedType");
    localStorage.removeItem("launchly_formData");
    localStorage.removeItem("launchly_generatedContent");
  };

  const value = {
    selectedType,
    setSelectedType,
    formData,
    setFormData,
    generatedContent,
    setGeneratedContent,
    clearState,
  };

  return (
    <LaunchContext.Provider value={value}>{children}</LaunchContext.Provider>
  );
};
