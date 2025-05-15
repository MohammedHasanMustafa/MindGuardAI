import React from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { FaRobot } from "react-icons/fa"; // Chatbot icon
import Sidebar from "../UserDashboardPages/Sidebar";
import WellnessOverview from "../UserDashboardPages/WellnessOverview";
import Resources from "../UserDashboardPages/Resourses";
import RiskAlerts from "../UserDashboardPages/RiskAlerts";
import Suggestions from "../UserDashboardPages/Suggestions";
import TrendGraphs from "../UserDashboardPages/TrendGraphs";
import SelfAssessment from "../UserDashboardPages/SelfAssessment";
import Settings from "../UserDashboardPages/Settings";
import Community from "../UserDashboardPages/Community";
import Chatbot from "../UserDashboardPages/Chatbot"; 
import { PiChatCircleDotsFill } from "react-icons/pi";
import ReportsPage from "../UserDashboardPages/ReportsPage";


const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 transition-all duration-300">
        <div className="p-6">
          <Routes>
            {/* Protecting Dashboard Routes with PrivateRoute */}
            <Route
              path="/*"
              element={
                
                  <Routes>
                    <Route path="wellness-overview" element={<WellnessOverview />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="risk-alerts" element={<RiskAlerts />} />
                    <Route path="suggestions" element={<Suggestions />} />
                    <Route path="trend-graphs" element={<TrendGraphs />} />
                    <Route path="self-assessment" element={<SelfAssessment />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="community" element={<Community />} />
                    <Route path="reports" element={<ReportsPage/>} />
                    <Route path="chatbot" element={<Chatbot />} />
                    <Route index element={<WellnessOverview />} />
                  </Routes>
               
              }
            />

            {/* Default Route */}
            <Route path="*" element={<h1 className="text-center text-xl">404 - Page Not Found</h1>} />
          </Routes>

         
          {location.pathname !== '/dashboard/chatbot' && (
            <button
              onClick={() => navigate("/dashboard/chatbot")}
              className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 
                bg-[#032f45] text-white hover:scale-110 hover:shadow-xl"
            >
              <PiChatCircleDotsFill size={28} className="drop-shadow-md" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;