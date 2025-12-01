import React from "react";
import { FileText, LayoutTemplate } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLaunch } from "../context/LaunchContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setSelectedType } = useLaunch();

  const handleSelect = (type) => {
    setSelectedType(type);
    navigate("/create");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 tracking-tight text-center">
        What do you want to build?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl w-full">
        {/* Simple Form */}
        <button
          onClick={() => handleSelect("simple")}
          className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-10 flex flex-col items-center text-center"
        >
          <div className="p-5 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
            <FileText className="w-14 h-14 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Simple Form
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xs">
            Quickly generate a clean and effective lead capture form with
            AI‑powered content.
          </p>
        </button>

        {/* Landing Page */}
        <button
          onClick={() => handleSelect("landing")}
          className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-10 flex flex-col items-center text-center"
        >
          <div className="p-5 bg-purple-50 rounded-full mb-6 group-hover:bg-purple-100 transition-colors">
            <LayoutTemplate className="w-14 h-14 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Full Landing Page
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xs">
            Generate a complete landing page with professional copy, sections,
            and layout ideas.
          </p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
