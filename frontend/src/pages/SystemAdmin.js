import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";

function SystemAdmin() {
  const [users, setUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [resettingEmail, setResettingEmail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("drEmail");
    const role = localStorage.getItem("drRole");
    setUserEmail(email);
    setUserRole(role);
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/users-overview`)
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleResetPassword = async (email, userType, userName) => {
    if (
      !window.confirm(
        `Reset password for ${email}?\n\nThe password will be set to their email address.`,
      )
    )
      return;
    setResettingEmail(email);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/reset-password`,
        { email, userType, userName },
      );
      if (response.status === 200)
        alert(
          `✅ Password reset successful!\n\nPassword for ${email} has been set to: ${email}`,
        );
    } catch (error) {
      alert("❌ Failed to reset password.");
    } finally {
      setResettingEmail(null);
    }
  };

  const handleDeleteStaff = (email, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete staff member: ${name || email}?`,
      )
    )
      return;
    setDeletingId(email);
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-staff/${email}`,
      )
      .then(() => {
        setUsers(users.filter((u) => u.Email !== email));
        alert("✅ Staff member deleted successfully");
      })
      .catch((err) => alert("❌ Failed to delete staff member"))
      .finally(() => setDeletingId(null));
  };

  const staff = users.filter((u) => u.type?.toLowerCase().includes("doctor"));
  const couples = users.filter((u) => u.type?.toLowerCase().includes("couple"));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="System Administration"
        subtitle="Manage staff, reset passwords, and monitor system access"
        userEmail={userEmail}
        userRole={userRole}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-purple-100 text-xs font-bold uppercase">
              Total Staff
            </p>
            <p className="text-3xl font-bold mt-1">{staff.length}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-xs font-bold uppercase">
              Registered Couples
            </p>
            <p className="text-3xl font-bold mt-1">{couples.length}</p>
          </div>
        </div>

        <div className="space-y-10">
          {[
            { title: "Medical Staff", data: staff, isStaff: true },
            { title: "Registered Couples", data: couples, isStaff: false },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {section.title}
              </h3>
              <div className="bg-white shadow rounded-xl overflow-hidden">
                {section.data.map((u, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 gap-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {u.Name?.charAt(0) || u.Email.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {u.Name || u.Email}
                        </p>
                        <p className="text-xs text-gray-500">{u.Email}</p>
                      </div>
                    </div>

                    {/* Responsive Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleResetPassword(
                            u.Email,
                            section.isStaff ? "staff" : "couple",
                            u.Name,
                          )
                        }
                        className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100"
                      >
                        Reset Password
                      </button>
                      {section.isStaff && (
                        <button
                          onClick={() => handleDeleteStaff(u.Email, u.Name)}
                          className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
                        >
                          Delete
                        </button>
                      )}
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

export default SystemAdmin;
