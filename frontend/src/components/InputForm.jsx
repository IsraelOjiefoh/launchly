import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLaunch } from "../context/LaunchContext";
import axios from "axios";

const InputForm = () => {
  const navigate = useNavigate();
  const { selectedType, formData, setFormData, setGeneratedContent } =
    useLaunch();
  const [isLoading, setIsLoading] = useState(false);

  const [goal, setGoal] = useState(formData?.goal || "Collect Leads");
  const [prompt, setPrompt] = useState(formData?.prompt || "");

  useEffect(() => {
    if (!selectedType) {
      navigate("/");
    }
  }, [selectedType, navigate]);

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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center text-slate-500 hover:text-brand-600 mb-8 transition-colors font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 group-hover:border-brand-200 group-hover:bg-brand-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Dashboard
        </button>

        <div className="glass-card rounded-3xl p-8 md:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold mb-4 border border-brand-100 uppercase tracking-wider">
              {selectedType === "simple" ? "Simple Form" : "Landing Page"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading mb-2">
              Let's build something{" "}
              <span className="text-gradient">amazing</span>.
            </h2>
            <p className="text-slate-500">
              Tell us about your project, and our AI will handle the rest.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                What is your primary goal?
              </label>
              <div className="relative">
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none font-medium text-slate-700"
                >
                  <option>Collect Leads</option>
                  <option>Sell a Product</option>
                  <option>Promote a Course</option>
                  <option>Schedule Appointments</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Business type or purpose
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., An AI-powered tool that helps freelancers manage their taxes..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-40 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Content
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
