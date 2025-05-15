import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mb-0">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand & About */}
        <div>
          <h2 className="text-3xl font-bold text-blue-400">MindGuard</h2>
          <p className="mt-3 text-gray-300 text-sm">
            AI-powered mental health insights and personalized support for well-being.
          </p>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
          </ul>
        </div>

        {/* Newsletter & Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Stay Updated</h3>
          <div className="flex mt-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 text-black rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-500 px-4 py-2 rounded-r-md hover:bg-blue-600">
              <Mail className="text-white" size={20} />
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-5">
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 text-center mt-10 pt-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} MindGuard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
