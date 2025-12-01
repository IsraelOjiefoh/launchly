import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLaunch } from "../context/LaunchContext";
import { supabase } from "../lib/supabaseClient";

const Preview = () => {
  const navigate = useNavigate();
  const { generatedContent, setGeneratedContent, selectedType, formData } =
    useLaunch();
  const [iframeHtml, setIframeHtml] = useState("");
  const latestContent = useRef(generatedContent);

  useEffect(() => {
    if (!generatedContent) {
      navigate("/create");
      return;
    }
    latestContent.current = generatedContent;
  }, [generatedContent, navigate]);

  useEffect(() => {
    if (selectedType === "landing" && generatedContent?.html) {
      const script = `
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            const style = document.createElement('style');
            style.textContent = \`
              [contenteditable]:hover { outline: 2px dashed #3b82f6; cursor: text; }
              [contenteditable]:focus { outline: 2px solid #2563eb; }
            \`;
            document.head.appendChild(style);

            const elements = document.querySelectorAll('h1, h2, h3, h4, p, button, a, span, li');
            elements.forEach(el => {
              if (el.innerText.trim()) {
                el.contentEditable = true;
                el.addEventListener('input', () => {
                   window.parent.postMessage({ type: 'content-update', html: document.documentElement.outerHTML }, '*');
                });
              }
            });
          });
        </script>
      `;
      let html = generatedContent.html;
      if (html.includes("</body>")) {
        html = html.replace("</body>", `${script}</body>`);
      } else {
        html += script;
      }
      setIframeHtml(html);
    }
  }, [generatedContent, selectedType]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "content-update") {
        const newContent = { ...latestContent.current, html: event.data.html };
        latestContent.current = newContent;
        // We don't update context on every keystroke to avoid re-renders,
        // but we could if we wanted real-time persistence across refreshes while editing.
        // For now, we'll update it when saving or leaving?
        // Actually, let's update context on save, or maybe debounced.
        // For simplicity, we'll just keep it in ref and update context on save.
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSave = async () => {
    if (!latestContent.current || !formData) return;

    // Update context with latest edits
    setGeneratedContent(latestContent.current);

    try {
      const { error } = await supabase.from("generated_pages").insert([
        {
          type: selectedType,
          content: latestContent.current,
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

  if (!generatedContent) return null;

  if (selectedType === "landing" && generatedContent.html) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/create")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Editor
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
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

            {/* HTML Content Preview */}
            <div className="w-full overflow-hidden">
              <iframe
                srcDoc={iframeHtml}
                className="w-full border-0"
                style={{ height: "600px" }}
                sandbox="allow-same-origin allow-popups allow-scripts"
                title="Landing Page Preview"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Editor
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
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
            {selectedType === "simple" ? (
              <div className="max-w-xl mx-auto text-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  {generatedContent.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {generatedContent.description}
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled
                  />
                  <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    {generatedContent.cta}
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
                    {generatedContent.headline}
                  </h1>
                  <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
                    {generatedContent.subheadline}
                  </p>
                  <div className="flex justify-center gap-4 pt-4">
                    <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      {generatedContent.cta}
                    </button>
                    <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-gray-100">
                  {generatedContent.features?.map((feature, i) => (
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
                    {generatedContent.testimonials?.map((t, i) => (
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
