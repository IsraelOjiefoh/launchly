import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InputForm from "./components/InputForm";
import Preview from "./components/Preview";
import { LaunchProvider } from "./context/LaunchContext";

function App() {
  return (
    <LaunchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<InputForm />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LaunchProvider>
  );
}

export default App;
