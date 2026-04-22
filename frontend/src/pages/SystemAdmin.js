import React, { useEffect, useState } from "react";
import axios from "axios";

function SystemAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users-overview")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🔴 Delete user function
  const handleDelete = (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:5000/api/admin/delete-user/${email}`)
      .then(() => {
        // Remove from UI instantly
        setUsers(users.filter((u) => u.Email !== email));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
      });
  };

  const admins = users.filter((u) => u.type?.toLowerCase().includes("doctor"));
  const couples = users.filter((u) => u.type?.toLowerCase().includes("couple"));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          System Administration
        </h2>

        {/* 🧑‍💼 Admins Section */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Admin Users
          </h3>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {admins.length === 0 ? (
              <p className="p-6 text-gray-500">No admins found.</p>
            ) : (
              admins.map((u, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b px-6 py-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{u.Email}</p>
                    {u.Name && (
                      <p className="text-sm text-gray-500">{u.Name}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(u.Email)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ❤️ Couples Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Couples</h3>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {couples.length === 0 ? (
              <p className="p-6 text-gray-500">No couples found.</p>
            ) : (
              couples.map((u, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b px-6 py-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{u.Email}</p>
                    {u.Name && (
                      <p className="text-sm text-gray-500">{u.Name}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(u.Email)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemAdmin;
