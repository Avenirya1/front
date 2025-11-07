import React from "react";
import { Helmet } from "react-helmet";
import { MessageCircle } from "lucide-react";

// ✅ A single list of all premium features, pulled from your "Pro" plan
const allFeatures = [
  "Unlimited Menu Items",
  "WhatsApp Ordering Feature",
  "Add Offer Banners",
  "Full Dashboard Access",
  "All QR Code & Menu Designs",
  "AI Menu Upload & Image Upload",
  "Connect Instagram / Social to Menu",
  "Take Google Map Reviews",
  "Add Custom Line (e.g., 'We take party orders')",
  "Dedicated Support",
  "Unlimited Menu Updates",
];

const MembershipPage = () => {
  return (
    <>
      {/* ✅ Main section with new layout */}
      <section className="relative py-16 bg-white min-h-screen flex items-center">
        <Helmet>
          <title>
            Scroll Menus - Your Restaurant’s Menu, Just a Scan Away. solution
            by RR Digital Solutions.
          </title>
          <meta
            name="description"
            content="Scroll Menus - Your Restaurant’s Menu, Just a Scan Away. solution by RR Digital Solutions. Customers scan, order, and enjoy a contactless dining experience."
          />
          <link
            rel="icon"
            href="https://petoba.avenirya.com/wp-content/uploads/2025/09/download-1.png"
            type="image/png"
          />
          <meta
            property="og:image"
            content="https://petoba.avenirya.com/wp-content/uploads/2025/09/Untitled-design-6.png"
          />
          <meta property="og:title" content="Petoba - Digital QR Menu" />
          <meta
            property="og:description"
            content="Turn your restaurant’s menu into a digital QR code menu."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://yash.avenirya.com" />
        </Helmet>
        
        {/* Background blobs (unchanged) */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-40 -right-20  h-80 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, Powerful Menu Solutions
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            We offer custom plans tailored for your business, anywhere in the world.
          </p>

          {/* --- ✅ New 2-Column Layout --- */}
          <div className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              {/* --- Left Column (Features & CTA) --- */}
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                  Premium & Pro Features
                </h3>
                <p className="text-gray-700 mb-6">
                  Unlock powerful tools to grow your business. We offer custom plans
                  tailored to your needs.
                </p>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {allFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-500">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Inquiry Button */}
                <a
                  href="https://wa.me/919494678811?text=Hi!%20I%20would%20like%20to%20inquire%20about%20the%20pricing%20."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <button
                    className="text-xl py-3 px-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                  >
                    Inquire for Pricing
                  </button>
                </a>
              </div>
              
              {/* --- Right Column (Image) --- */}
              <div>
                <img
                  src="https://i.ibb.co/1fkFh5Vc/image-removebg-preview-33.png"
                  alt="Scroll Menus Digital QR Menu Demonstration"
                  className=""
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button (unchanged) */}
      <a
        href="https://wa.me/919494678811?text=Hi! is there anyone to chat?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        <MessageCircle size={22} />
        <span>Need Help?</span>
      </a>
    </>
  );
};

export default MembershipPage;