import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  UserCheck,
  Star,
  Bell,
  ClipboardList,
  LineChart,
  BarChart,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const menuItems = [
    { title: "Wellness Overview", icon: <UserCheck size={20} />, path: "/dashboard/wellness-overview" },
    { title: "Resources", icon: <Star size={20} />, path: "/dashboard/resources" },
    { title: "Risk Alerts", icon: <Bell size={20} />, path: "/dashboard/risk-alerts" },
    { title: "Suggestions", icon: <ClipboardList size={20} />, path: "/dashboard/suggestions" },
    { title: "Trend Graphs", icon: <LineChart size={20} />, path: "/dashboard/trend-graphs" },
    { title: "Self-Assessment", icon: <BarChart size={20} />, path: "/dashboard/self-assessment" },
    { title: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings" },
    { title: "Community", icon: <Users size={20} />, path: "/dashboard/community" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-800 text-white transition-all duration-300 fixed h-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">MindGuard</h1>}
          <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-gray-700">
            <Menu size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col p-2 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.title}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                location.pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </div>

        
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-auto ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Your main content will go here */}
      </div>
    </div>
  );
};

export default Sidebar;
