import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-6 mt-10 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="mb-2">&copy; 2025 BrewBox. All rights reserved.</p>
        <p className="space-x-4">
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
