import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import InputForm from "./components/InputForm";
import Preview from "./components/Preview";
import axios from "axios";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [view, setView] = useState("dashboard"); // dashboard, form, preview
  const [selectedType, setSelectedType] = useState(null); // simple, landing
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setView("form");
  };

  const handleBackToDashboard = () => {
    setView("dashboard");
    setSelectedType(null);
    setGeneratedContent(null);
  };

  const handleBackToForm = () => {
    setView("form");
  };

  const handleGenerate = async (data) => {
    setIsLoading(true);
    setFormData(data);
    try {
      // Use the environment variable for the backend URL
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000/api/generate";

      const response = await axios.post(backendUrl, {
        type: data.type,
        prompt: data.prompt,
        goal: data.goal,
      });

      setGeneratedContent(response.data);
      setView("preview");
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent || !formData) return;

    try {
      const { error } = await supabase.from("generated_pages").insert([
        {
          type: selectedType,
          content: generatedContent,
          goal: formData.goal,
          prompt: formData.prompt,
        },
      ]);

      if (error) throw error;
      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save to database.");
    }
  };

  return (
    <div>
      {view === "dashboard" && <Dashboard onSelect={handleSelectType} />}

      {view === "form" && (
        <InputForm
          type={selectedType}
          onBack={handleBackToDashboard}
          onSubmit={handleGenerate}
          isLoading={isLoading}
        />
      )}

      {view === "preview" && (
        <Preview
          content={generatedContent}
          type={selectedType}
          onBack={handleBackToForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App;
