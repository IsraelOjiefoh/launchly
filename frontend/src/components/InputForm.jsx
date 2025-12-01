import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLaunch } from "../context/LaunchContext";
import axios from "axios";

const InputForm = () => {
  const navigate = useNavigate();
  const { selectedType, formData, setFormData, setGeneratedContent } =
    useLaunch();
  const [isLoading, setIsLoading] = useState(false);

  // Local state for inputs, initialized from context
  const [goal, setGoal] = useState(formData?.goal || "Collect Leads");
  const [prompt, setPrompt] = useState(formData?.prompt || "");

  useEffect(() => {
    if (!selectedType) {
      navigate("/");
    }
  }, [selectedType, navigate]);

  // Update context when inputs change (optional, but good for persistence if they leave page)
  useEffect(() => {
    setFormData({ goal, prompt });
  }, [goal, prompt, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000/api/generate";

      const response = await axios.post(backendUrl, {
        type: selectedType,
        prompt: prompt,
        goal: goal,
      });

      setGeneratedContent(response.data);
      navigate("/preview");
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {selectedType === "simple"
              ? "Create Simple Form"
              : "Create Landing Page"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your primary goal?
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option>Collect Leads</option>
                <option>Sell a Product</option>
                <option>Promote a Course</option>
                <option>Schedule Appointments</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business type or purpose
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., An AI-powered tool that helps freelancers manage their taxes..."
                className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                "Generate Content"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
