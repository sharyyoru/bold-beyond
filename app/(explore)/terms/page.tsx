import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center gap-4 px-4 py-4 max-w-3xl mx-auto">
          <Link href="/welcome" className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Terms & Conditions</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bold & Beyond Terms & Conditions
        </h2>
        
        <p className="text-sm text-gray-500 mb-6">
          Effective: August 30, 2025
        </p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to Bold & Beyond Coaching ("we," "our," "us"). These Terms & Conditions govern your use of our website www.boldandbeyondcoaching.ae and our coaching services. By accessing our website or booking any services, you agree to these terms. Please read them carefully.
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">1. Services</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>We provide professional coaching services, including but not limited to Career Coaching, Emotional Reset Coaching, Nature-Informed/Ecotherapy Coaching, and Relationship Coaching.</li>
              <li>Coaching is a process of personal and professional development and does not provide therapy, medical treatment, or legal/financial advice.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">2. Eligibility</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old to use our services.</li>
              <li>By booking, you confirm that you are legally able to enter into a binding contract in the UAE.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">3. Booking & Payment</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All bookings must be made through our website or authorized channels.</li>
              <li>Payment is due at the time of booking.</li>
              <li>We reserve the right to change pricing at any time, with changes applicable to future bookings only.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">4. Cancellations & Refunds</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cancellations must be made at least 24 hours before the scheduled session.</li>
              <li>Sessions canceled within less than 24 hours' notice may be charged in full.</li>
              <li>Refunds, where applicable, will be processed within [X] business days.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">5. Client Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>You agree to provide accurate personal information and keep it updated.</li>
              <li>You are responsible for your own progress and involvement in the coaching process and for implementing any recommendations.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">6. Confidentiality</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All information shared during coaching sessions will remain confidential, unless disclosure is required by law.</li>
              <li>We may use anonymized, non-identifiable information for training and improvement purposes.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">7. Limitation of Liability</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bold & Beyond is not liable for any direct, indirect, or consequential damages arising from the use of our services.</li>
              <li>Results from coaching depend on your own commitment and actions and are not guaranteed.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">8. Intellectual Property</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All content on the website, including text, graphics, and materials, is owned by Bold & Beyond and protected by copyright laws.</li>
              <li>You may not reproduce, copy, or use our content without written permission.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">9. Changes to Terms</h3>
            <p>We may update these Terms & Conditions at any time. Any changes will be posted here with an updated effective date.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">10. Contact Us</h3>
            <p>For questions about these Terms & Conditions, please contact us at:</p>
            <p className="mt-2">
              Email: <a href="mailto:info@boldandbeyondcoaching.ae" className="text-brand-teal hover:underline">info@boldandbeyondcoaching.ae</a><br />
              Phone: +971 56 889 7206
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
