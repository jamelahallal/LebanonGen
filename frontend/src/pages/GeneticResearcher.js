import React, { useEffect, useState } from "react";
import axios from "axios";

function GeneticResearcher() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/region-stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ✅ Calculate totals
  const totalCarriers = stats.reduce((sum, s) => sum + s.carriers, 0);
  const totalInfected = stats.reduce((sum, s) => sum + s.infected, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Regional Genetic Mapping
          </h2>
          <p className="text-gray-600 mt-1">
            Distribution of carriers and infected cases by region
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 uppercase font-bold">
              Total Carriers
            </p>
            <p className="text-2xl font-semibold text-blue-600">
              {totalCarriers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500 uppercase font-bold">
              Total Infected
            </p>
            <p className="text-2xl font-semibold text-red-600">
              {totalInfected}
            </p>
          </div>
        </div>

        {/* Regions Grid */}
        {loading ? (
          <div className="text-center text-gray-500 italic">
            Loading regional data...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.Name}
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {s.Name}
                </h3>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Carriers</span>
                  <span className="font-bold text-blue-600">{s.carriers}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Infected</span>
                  <span className="font-bold text-red-600">{s.infected}</span>
                </div>

                {/* Mini visual bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500"
                      style={{
                        width: `${
                          s.carriers + s.infected > 0
                            ? (s.carriers / (s.carriers + s.infected)) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Carrier ratio</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneticResearcher;
