import React from "react";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";

const Preview = ({ content, type, onBack, onSave }) => {
  if (!content) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <div className="flex gap-4">
            <button
              onClick={onSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Browser Mockup Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          {/* Content Preview */}
          <div className="p-8 md:p-12">
            {type === "simple" ? (
              <div className="max-w-xl mx-auto text-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {content.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {content.description}
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled
                  />
                  <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {content.cta}
                  </button>
                  <p className="text-xs text-gray-400 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                    {content.headline}
                  </h1>
                  <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
                    {content.subheadline}
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      {content.cta}
                    </button>
                    <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
                  {content.features?.map((feature, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg mb-4 flex items-center justify-center text-blue-600 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-lg font-medium text-gray-800">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="bg-gray-900 text-white -mx-8 md:-mx-12 p-12 md:p-20 rounded-xl">
                  <h3 className="text-2xl font-bold text-center mb-12">
                    Trusted by Early Adopters
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {content.testimonials?.map((t, i) => (
                      <div key={i} className="bg-gray-800 p-8 rounded-xl">
                        <p className="text-lg italic mb-4 text-gray-300">
                          "{t.text}"
                        </p>
                        <p className="font-bold text-blue-400">{t.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
