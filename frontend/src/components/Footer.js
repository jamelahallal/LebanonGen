import { Link } from "react-router-dom";
import { GiDna2 } from "react-icons/gi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 z-10">
        {/* Column 1: Brand */}
        <div className="flex flex-col items-start space-y-2">
          <Link to="/" className="flex items-center gap-3">
            <GiDna2 className="text-red-600 text-3xl" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gray-900">
                Lebanon<span className="text-red-600">Gen</span>
              </span>
              <span className="text-sm text-gray-500">
                Sickle Cell Awareness
              </span>
            </div>
          </Link>
          <p className="mt-4 text-gray-600 max-w-xs">
            LebanonGen is dedicated to raising awareness about Sickle Cell and
            providing tools for couples to understand genetic compatibility.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-3">
            <a
              href="#"
              className="text-gray-600 hover:text-red-600 transform hover:scale-110 transition duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-600 transform hover:scale-110 transition duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-600 transform hover:scale-110 transition duration-300"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-lg font-semibold mb-2 text-gray-900">
            Navigation
          </h4>
          <Link
            to="/"
            className="hover:text-red-600 transform hover:text-bold text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-red-600 transform hover:text-bold text-gray-700"
          >
            About Us
          </Link>
          <Link
            to="/form"
            className="hover:text-red-600 transform hover:text-bold text-gray-700"
          >
            Compatibility Form
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-red-600 transform hover:text-bold text-gray-700"
          >
            Health Dashboard
          </Link>
          <Link
            to="/login"
            className="hover:text-red-600 transform hover:text-bold text-gray-700"
          >
            Login
          </Link>
        </div>

        {/* Column 3: Contact */}
        <div className="flex flex-col space-y-2">
          <h4 className="text-lg font-semibold mb-2 text-gray-900">Contact</h4>
          <p className="flex items-center gap-2 text-gray-700">
            <MdLocationOn className="text-red-600" /> Beirut, Lebanon
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <MdEmail className="text-red-600" /> sickle@lebanongen.com
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <MdPhone className="text-red-600" /> +961 71 123 456
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 text-gray-500 text-sm text-center py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} LebanonGen — Sickle Cell Awareness &
        Prevention
      </div>
    </footer>
  );
}
