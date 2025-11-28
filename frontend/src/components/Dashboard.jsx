import React from "react";
import { FileText, LayoutTemplate } from "lucide-react";

const Dashboard = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        What do you want to build?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Simple Form Card */}
        <button
          onClick={() => onSelect("simple")}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-500 group"
        >
          <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Simple Form
          </h2>
          <p className="text-gray-600 text-center">
            Generate a catchy title, description, and CTA for a simple lead
            capture form.
          </p>
        </button>

        {/* Full Landing Page Card */}
        <button
          onClick={() => onSelect("landing")}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-purple-500 group"
        >
          <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
            <LayoutTemplate className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Full Landing Page
          </h2>
          <p className="text-gray-600 text-center">
            Create a complete landing page with headline, features,
            testimonials, and more.
          </p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
