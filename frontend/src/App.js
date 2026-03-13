import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CoupleForm from "./components/CoupleForm";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About"
import Login from "./pages/Login";
import ScrollToTop from "./utils/ScrollOnTop";
function App() {
  return (

<Router>
<ScrollToTop />
<Navbar/>
<Routes>

<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/form" element={<CoupleForm />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/login" element={<Login />} />

</Routes>
</Router>

  );
}

export default App;