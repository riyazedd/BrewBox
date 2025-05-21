// components/Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-gray-300 py-6 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">BrewBox</h2>
          <p className="mt-2 text-sm text-gray-400">Delivering premium coffee to your doorstep.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="about-us" className="hover:text-white">About</a></li>
            <li><a href="contact-us" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-300 text-sm mt-10">
        &copy; {new Date().getFullYear()} BrewBox. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
