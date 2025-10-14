import React from "react";
import { FileText, Globe, AlertCircle, Lock } from "lucide-react";

const Terms = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 px-6 py-12 md:px-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Clear, transparent, and easy-to-understand terms for your trust ✨
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-pink-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions outline the rules and regulations for using <b>Lil’daisy Store</b>,
              located at <b>lildaisystore.com</b>. The website is owned and operated by <b>Sakshi Kakkar</b>. 
              By accessing or purchasing from our site, you agree to be bound by these Terms of Service.
            </p>
          </div>

          {/* Acceptance & Changes */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-purple-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                2. Acceptance & 3. Changes to Terms
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>
                By accessing or using any part of the site, you agree to comply with these Terms of Service.
                If you disagree, you may not access the website or use our services.
              </li>
              <li>
                We may update, change, or replace any part of these terms by posting updates on our site. 
                Continued use after updates constitutes acceptance of the changes.
              </li>
            </ul>
          </div>

          {/* Store & General Conditions */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-indigo-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                4. Online Store & 5. General Conditions
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>
                By agreeing to these Terms, you confirm that you are at least the age of majority in your 
                place of residence and will not use our products for any unlawful purpose.
              </li>
              <li>
                We reserve the right to refuse service to anyone, anytime, for any reason. 
                You agree not to reproduce or exploit any portion of the Service without our written consent.
              </li>
            </ul>
          </div>

          {/* Product & Pricing */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-purple-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                6–9. Accuracy, Modifications, Products & Billing
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>Product prices and availability are subject to change without notice.</li>
              <li>
                We are not responsible for inaccurate or outdated information. Material on the site is for 
                general informational purposes only.
              </li>
              <li>
                We reserve the right to refuse any order, limit sales by person or region, and require accurate 
                billing and account information.
              </li>
            </ul>
          </div>

          {/* Third-Party & Privacy */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-pink-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                10–12. Tools, Links & Personal Information
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>
                We may provide access to third-party tools and links at your own discretion. 
                We are not responsible for external content.
              </li>
              <li>
                Your personal information submitted through the store is governed by our <b>Privacy Policy</b>.
              </li>
            </ul>
          </div>

          {/* Errors, Prohibited Use, Disclaimer */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-indigo-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                13–15. Errors, Prohibited Use & Disclaimer
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>
                We may correct any errors or omissions on the site without prior notice.
              </li>
              <li>
                You are prohibited from using the site for unlawful purposes or violating any rights.
              </li>
              <li>
                We do not guarantee uninterrupted or error-free service. All products are provided “as is”.
              </li>
            </ul>
          </div>

          {/* Termination & Entire Agreement */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-purple-500 w-6 h-6" />
              <h2 className="text-xl font-semibold text-gray-900">
                16–18. Termination & Entire Agreement
              </h2>
            </div>
            <ul className="pl-6 space-y-3 text-gray-700 list-disc">
              <li>
                These Terms remain effective until terminated by either party. We may terminate access for 
                violations at any time.
              </li>
              <li>
                These Terms of Service and any policies posted on the site constitute the entire agreement 
                between you and us.
              </li>
              <li>
                Continued use of the website after updates implies acceptance of revised terms.
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="text-center text-gray-600 mt-10">
            <AlertCircle className="mx-auto mb-3 text-pink-400 w-6 h-6" />
            <p>Thank you for reading and agreeing to our Terms of Service 💫</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
