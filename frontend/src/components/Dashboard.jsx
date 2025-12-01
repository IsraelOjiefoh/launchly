import React from "react";
import { FileText, LayoutTemplate, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/10 rounded-full blur-3xl -z-10" />

      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6 border border-brand-100">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Page Builder
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight font-heading leading-tight">
          Build <span className="text-gradient">stunning</span> pages in
          seconds.
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Launchly helps you generate high-converting landing pages and forms
          with just a simple prompt. No coding required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full animate-slide-up">
        {/* Simple Form Card */}
        <button
          onClick={() => handleSelect("simple")}
          className="group relative bg-white rounded-3xl p-8 text-left border border-slate-100 shadow-soft hover:shadow-float transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-32 h-32 text-brand-600 transform rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 font-heading">
              Simple Form
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Perfect for capturing leads, waiting lists, or simple contact
              forms. Clean, focused, and effective.
            </p>
            <div className="flex items-center text-brand-600 font-semibold group-hover:translate-x-2 transition-transform">
              Start Building <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </button>

        {/* Landing Page Card */}
        <button
          onClick={() => handleSelect("landing")}
          className="group relative bg-white rounded-3xl p-8 text-left border border-slate-100 shadow-soft hover:shadow-float transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutTemplate className="w-32 h-32 text-purple-600 transform -rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <LayoutTemplate className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 font-heading">
              Full Landing Page
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Generate a complete, multi-section landing page with hero,
              features, testimonials, and more.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
              Start Building <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
