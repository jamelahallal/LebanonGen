import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardHeader({ title, subtitle, userEmail, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("drToken");
    localStorage.removeItem("drRole");
    localStorage.removeItem("drName");
    localStorage.removeItem("drEmail");
    navigate("/drlog");
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "researcher":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "doctor":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "🛡️";
      case "researcher":
        return "🔬";
      case "doctor":
        return "👨‍⚕️";
      default:
        return "👤";
    }
  };

  return (
    <>
      {/* Top Navigation Bar - Compact version */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-20">
            {/* User Info & Logout Button - Right side */}
            <div className="flex items-center space-x-4">
              {/* User Details */}
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md text-sm">
                    {userEmail?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* User Details */}
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-gray-900">
                    {userEmail || "Not logged in"}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">
                      {getRoleIcon(userRole)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getRoleBadgeColor(
                        userRole
                      )}`}
                    >
                      {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) ||
                        "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header - Reduced height */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
            </div>
            
            {/* Quick Stats or Additional Info */}
            <div className="hidden lg:block text-right">
              <p className="text-xs text-gray-500">Session Active</p>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;