import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";

function GeneticResearcher() {
  const [regionStats, setRegionStats] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("drEmail");
    const role = localStorage.getItem("drRole");
    setUserEmail(email);
    setUserRole(role);

    const fetchData = async () => {
      try {
        const [regionRes, overallRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/admin/genetic-region-stats`,
          ),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/admin/genetic-overall-stats`,
          ),
        ]);
        setRegionStats(regionRes.data);
        setOverallStats(overallRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching genetic data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRegions = regionStats.filter(
    (r) => r.total_individuals > 0,
  ).length;
  const totalCarriers = overallStats?.total_carriers || 0;
  const totalInfected = overallStats?.total_infected || 0;
  const totalNormal = overallStats?.total_normal || 0;
  const totalIndividuals = overallStats?.total_individuals || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading regional genetic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Regional Genetic Mapping"
        subtitle="Distribution of AA, AS, and SS by region"
        userEmail={userEmail}
        userRole={userRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            {
              label: "Total Regions",
              val: totalRegions,
              col: "gray",
              icon: "🗺️",
            },
            {
              label: "Normal (AA)",
              val: totalNormal,
              col: "green",
              icon: "✅",
            },
            {
              label: "Carriers (AS)",
              val: totalCarriers,
              col: "yellow",
              icon: "🧬",
            },
            {
              label: "Infected (SS)",
              val: totalInfected,
              col: "red",
              icon: "⚠️",
            },
            {
              label: "Total Individuals",
              val: totalIndividuals,
              col: "purple",
              icon: "👥",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r from-${item.col}-500 to-${item.col}-600 rounded-xl shadow-lg p-4 text-white`}
            >
              <p className="text-xs uppercase font-bold opacity-80">
                {item.label}
              </p>
              <p className="text-3xl font-bold mt-1">{item.val}</p>
              <div className="text-2xl mt-2">{item.icon}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionStats.map((region) => (
            <div
              key={region.RegionID}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              <div
                className={`px-6 py-4 ${region.risk_level === "HIGH RISK" ? "bg-red-500" : region.risk_level === "MODERATE RISK" ? "bg-orange-500" : region.risk_level === "ELEVATED RISK" ? "bg-yellow-500" : "bg-green-500"}`}
              >
                <h3 className="text-lg font-semibold text-white">
                  {region.Name}
                </h3>
                <p className="text-white text-opacity-90 text-sm">
                  Total: {region.total_individuals}
                </p>
              </div>

              <div className="p-6">
                {["normal", "carriers", "infected"].map((type, i) => (
                  <div key={type} className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                      <span>{region[type] || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${i === 0 ? "bg-green-500" : i === 1 ? "bg-yellow-500" : "bg-red-500"} h-2 rounded-full`}
                        style={{
                          width: `${region[`${type}_percentage`] || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GeneticResearcher;
