// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Footer from "../components/Footer";
// // import { Bar, Pie } from "react-chartjs-2";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   ArcElement,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   ArcElement,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend
// // );

// // function Dashboard() {
// //   const [barData, setBarData] = useState(null);
// //   const [pieData, setPieData] = useState(null);

// //   useEffect(() => {
// //     // BAR CHART DATA
// //     axios.get("http://localhost:8081/region-status-stats").then((res) => {
// //       const labels = res.data.map((item) => item.region);
// //       const carriers = res.data.map((item) => item.carriers);
// //       const infected = res.data.map((item) => item.infected);

// //       setBarData({
// //         labels: labels,
// //         datasets: [
// //           {
// //             label: "Carriers",
// //             data: carriers,
// //             backgroundColor: "rgba(255, 206, 86, 0.8)",
// //             borderRadius: 5,
// //           },
// //           {
// //             label: "Infected",
// //             data: infected,
// //             backgroundColor: "rgba(255, 99, 132, 0.8)",
// //             borderRadius: 5,
// //           },
// //         ],
// //       });
// //     });

// //     // PIE CHART DATA
// //     axios.get("http://localhost:8081/genetic-distribution").then((res) => {
// //       const labels = res.data.map((item) => item.status);
// //       const values = res.data.map((item) => item.total);

// //       setPieData({
// //         labels: labels,
// //         datasets: [
// //           {
// //             data: values,
// //             backgroundColor: labels.map((label) => {
// //               if (label.toLowerCase() === "normal") return "#4CAF50";  // Green
// //               if (label.toLowerCase() === "carrier") return "#FFC107"; // Yellow
// //               if (label.toLowerCase() === "infected") return "#F44336"; // Red
// //               return "#9E9E9E"; // Gray fallback
// //             }),
// //             hoverOffset: 10,
// //           },
// //         ],
// //       });
// //     });
// //   }, []);

// //   // CHART OPTIONS
// //   const barOptions = {
// //     responsive: true,
// //     maintainAspectRatio: true,
// //     aspectRatio: 2, 
// //     scales: {
// //       y: {
// //         beginAtZero: true,
// //         ticks: {
// //           stepSize: 1,
// //         },
// //       },
// //     },
// //     plugins: {
// //       legend: { position: "top" },
// //     },
// //   };

// //   const pieOptions = {
// //     responsive: true,
// //     maintainAspectRatio: true,
// //     plugins: {
// //       legend: { position: "bottom" },
// //     },
// //   };

// //   // INLINE STYLES
// //   const containerStyle = {
// //     padding: "120px 5% 60px",
// //     backgroundColor: "#f9f9f9",
// //     minHeight: "100vh",
// //   };

// //   const cardStyle = {
// //     background: "white",
// //     padding: "30px",
// //     borderRadius: "12px",
// //     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
// //     marginBottom: "40px",
// //     maxWidth: "900px",
// //     margin: "0 auto 40px auto",
// //   };

// //   return (
// //     <>
// //     <div style={containerStyle}>
// //       <header style={{ textAlign: "center", marginBottom: "50px" }}>
// //         <h1 style={{ color: "#8b0000", fontSize: "2.5rem" }}>
// //           Health Insights Dashboard
// //         </h1>
// //         <p style={{ color: "#666" }}>Sickle Cell Disease Statistics Across Lebanon</p>
// //       </header>

// //       {/* BAR CHART SECTION */}
// //       <div style={cardStyle}>
// //         <h3 style={{ marginBottom: "20px", color: "#333", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
// //           Carriers vs Infected by Region
// //         </h3>
// //         {barData ? (
// //           <Bar data={barData} options={barOptions} />
// //         ) : (
// //           <p>Loading Bar Chart...</p>
// //         )}
// //       </div>

// //       {/* PIE CHART SECTION */}
// //       <div style={{ ...cardStyle, maxWidth: "500px" }}>
// //         <h3 style={{ marginBottom: "20px", color: "#333", textAlign: "center" }}>
// //           Genetic Distribution
// //         </h3>
// //         {pieData ? (
// //           <Pie data={pieData} options={pieOptions} />
// //         ) : (
// //           <p>Loading Pie Chart...</p>
// //         )}
// //       </div>
// //     </div>
// //     <Footer />
// //     </>
// //   );
// // }

// // export default Dashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import LebanonMap from "../components/LebanonMap";

// function Dashboard() {
//   const [cases, setCases] = useState(null);

//   useEffect(() => {
//     axios.get("http://localhost:8081/region-status-stats")
//   .then((res) => {
//     const formatted = {};

//     res.data.forEach((item) => {
//   formatted[item.region] = Number(item.carriers) + Number(item.infected);
// });

//     setCases(formatted);
//   })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">
//         Lebanon Cases Map
//       </h1>

//       {cases ? (
//         <LebanonMap cases={cases} />
//       ) : (
//         <p>Loading map...</p>
//       )}
//     </div>
//   );
// }

// export default Dashboard;