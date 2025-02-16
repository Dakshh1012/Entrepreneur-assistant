import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/sidebar";
import FundraisingPage from "./pages/Fundraiser";
import AssistantPage from "./pages/Assistant";
import Challenges from "./pages/Challenges";
import IdeaValidationPage from "./pages/IdeaValidation";
import MailerAI from "./components/MailerAi";

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
        <Route element={<RecordingComponent />} path="/pitch-rater" />
        <Route element={<AssistantPage />} path="/assistant" />
        <Route element={<Challenges />} path="/challenges" />
        <Route element={<IdeaValidationPage />} path="/idea-validation" />
        <Route element={<MailerAI />} path="/mailer-ai" />
        {/* New Route for Pitch Rater */}
      </Routes>
    </div>
  );
}

export default App;
