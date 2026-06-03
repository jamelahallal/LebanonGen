import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";

function MedicalConsultant() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectedCouple, setSelectedCouple] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const parsePercent = (prob) =>
    prob === null || prob === undefined ? 0 : parseFloat(prob);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-red-600 text-white";
      case "VERY HIGH RISK":
        return "bg-orange-700 text-white";
      case "HIGH RISK":
        return "bg-orange-500 text-white";
      case "CARRIER RISK":
        return "bg-yellow-400 text-yellow-900";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getProgressColor = (probability) => {
    const percent = parsePercent(probability);
    if (percent >= 75.0) return "bg-red-600";
    if (percent >= 45.0) return "bg-orange-700";
    if (percent >= 20.0) return "bg-orange-500";
    if (percent >= 5.0) return "bg-yellow-400";
    return "bg-green-500";
  };

  const handleViewReport = async (email) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/couple-details/${encodeURIComponent(email)}`,
      );
      setSelectedCouple({
        ...response.data,
        riskLevel: response.data.riskLevel?.toUpperCase(),
      });
    } catch (error) {
      console.error("Error fetching couple details:", error);
      alert("Failed to load couple details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCouple(null);
  };

  useEffect(() => {
    setUserEmail(localStorage.getItem("drEmail"));
    setUserRole(localStorage.getItem("drRole"));
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/assessments`)
      .then((res) => {
        const normalizedData = res.data.map((item) => ({
          ...item,
          percentValue: Math.round(parsePercent(item.Probability)),
          riskLevel: item.RiskLevel?.toUpperCase(),
        }));
        setData(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching assessments:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      label: "Critical",
      val: data.filter((i) => i.riskLevel === "CRITICAL").length,
      color: "border-red-600",
      text: "text-red-600",
    },
    {
      label: "Very High",
      val: data.filter((i) => i.riskLevel === "VERY HIGH RISK").length,
      color: "border-orange-700",
      text: "text-orange-700",
    },
    {
      label: "High Risk",
      val: data.filter((i) => i.riskLevel === "HIGH RISK").length,
      color: "border-orange-500",
      text: "text-orange-500",
    },
    {
      label: "Carrier",
      val: data.filter((i) => i.riskLevel === "CARRIER RISK").length,
      color: "border-yellow-400",
      text: "text-yellow-600",
    },
    {
      label: "Low Risk",
      val: data.filter((i) => i.riskLevel === "LOW RISK").length,
      color: "border-green-500",
      text: "text-green-600",
    },
    {
      label: "Total",
      val: data.length,
      color: "border-blue-500",
      text: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Clinical Risk Review"
        subtitle="Review and manage high-risk genetic assessments"
        userEmail={userEmail}
        userRole={userRole}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${s.color}`}
            >
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                {s.label}
              </p>
              <p className={`text-xl font-bold ${s.text}`}>{s.val}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Risk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Probability
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.AssessmentID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.Email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${getRiskColor(item.riskLevel)}`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {item.percentValue}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${getProgressColor(item.Probability)}`}
                            style={{ width: `${item.percentValue}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewReport(item.Email)}
                        className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Couple Genetic Report
              </h2>
              <button onClick={closeModal} className="text-2xl">
                &times;
              </button>
            </div>
            <div className="p-6">
              {modalLoading ? (
                <p>Loading...</p>
              ) : (
                selectedCouple && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                      <p>
                        <strong>Email:</strong> {selectedCouple.email}
                      </p>
                      <p>
                        <strong>Risk Level:</strong> {selectedCouple.riskLevel}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <h3>Husband</h3>
                        <p>
                          Genotype: {selectedCouple.husband?.genotype || "N/A"}
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3>Wife</h3>
                        <p>
                          Genotype: {selectedCouple.wife?.genotype || "N/A"}
                        </p>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalConsultant;
