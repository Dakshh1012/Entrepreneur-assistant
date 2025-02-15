import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/sidebar";
import FundraisingPage from "./pages/Fundraiser";

import Dashboard from "@/pages/Dashboard";
import RecordingComponent from "@/components/RecordingComponent"; // Import the Recording Component

function App() {
  return (
    <div className="flex w-full">
      <Sidebar />
      <Routes>
        {/* <Route element={<IndexPage />} path="/" /> */}
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<FundraisingPage />} path="/fundraising" />
        <Route element={<RecordingComponent />} path="/pitch-rater" />{" "}
        {/* New Route for Pitch Rater */}
      </Routes>
    </div>
  );
}

export default App;
