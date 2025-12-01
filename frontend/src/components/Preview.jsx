import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Download,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLaunch } from "../context/LaunchContext";
import { supabase } from "../lib/supabaseClient";

const Preview = () => {
  const navigate = useNavigate();
  const { generatedContent, setGeneratedContent, selectedType, formData } =
    useLaunch();
  const [iframeHtml, setIframeHtml] = useState("");
  const latestContent = useRef(generatedContent);
  const [device, setDevice] = useState("desktop"); // desktop, tablet, mobile

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
              body { -webkit-font-smoothing: antialiased; }
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
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSave = async () => {
    if (!latestContent.current || !formData) return;

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

  const handleDownload = () => {
    if (selectedType === "landing" && latestContent.current?.html) {
      const blob = new Blob([latestContent.current.html], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "landing-page.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!generatedContent) return null;

  const getContainerWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "max-w-full";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/create")}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-md transition-all ${
                device === "desktop"
                  ? "bg-white shadow-sm text-brand-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-2 rounded-md transition-all ${
                device === "tablet"
                  ? "bg-white shadow-sm text-brand-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-md transition-all ${
                device === "mobile"
                  ? "bg-white shadow-sm text-brand-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          {selectedType === "landing" && (
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export HTML
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100/50">
        <div
          className={`w-full ${getContainerWidth()} transition-all duration-500 ease-in-out`}
        >
          {selectedType === "landing" && generatedContent.html ? (
            <div className="bg-white shadow-soft rounded-xl overflow-hidden min-h-[800px]">
              <iframe
                srcDoc={iframeHtml}
                className="w-full h-[800px] border-0"
                sandbox="allow-same-origin allow-popups allow-scripts"
                title="Landing Page Preview"
              />
            </div>
          ) : (
            <div className="bg-white shadow-soft rounded-xl p-12 min-h-[600px] flex items-center justify-center">
              {/* Simple Form Preview */}
              <div className="max-w-xl w-full text-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight font-heading">
                  {generatedContent.title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  {generatedContent.description}
                </p>
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                    disabled
                  />
                  <button className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg hover:shadow-brand-500/25">
                    {generatedContent.cta}
                  </button>
                  <p className="text-xs text-slate-400 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
