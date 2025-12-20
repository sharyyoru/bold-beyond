import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center gap-4 px-4 py-4 max-w-3xl mx-auto">
          <Link href="/welcome" className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bold & Beyond Privacy Policy
        </h2>
        
        <p className="text-sm text-gray-500 mb-6">
          Last updated: August 01, 2025
        </p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p>
            At Bold & Beyond Coaching ("we," "our," "us"), we are committed to protecting your privacy and ensuring the confidentiality of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit www.boldandbeyondcoaching.ae or use our services.
          </p>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">1. Information We Collect</h3>
            <p className="mb-2">We may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, email, phone number, billing address, and any details provided during booking or coaching sessions.</li>
              <li><strong>Session Notes:</strong> Information you share with your coach during sessions (kept confidential unless required by law).</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and manage coaching sessions.</li>
              <li>Process payments and send booking confirmations.</li>
              <li>Communicate with you about your appointments or services.</li>
              <li>Improve our website and offerings.</li>
              <li>Comply with legal requirements.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">3. Sharing of Information</h3>
            <p className="mb-2">We do not sell, trade, or rent your personal information to third parties.</p>
            <p className="mb-2">We may share data only when:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Required by UAE law or legal proceedings.</li>
              <li>Necessary to protect our rights or property.</li>
              <li>You provide explicit consent.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">4. Data Storage & Security</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your data is stored securely and accessible only to authorized personnel.</li>
              <li>While we use industry-standard security measures, no method of transmission over the Internet is 100% secure.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">5. Your Rights</h3>
            <p className="mb-2">Under UAE data protection principles, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request access to your personal data.</li>
              <li>Correct inaccurate or outdated information.</li>
              <li>Request deletion of your personal data (unless required to be kept by law).</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">6. Cookies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>We use cookies to enhance your browsing experience and analyze website traffic.</li>
              <li>You can adjust your browser settings to block cookies, though this may affect site functionality.</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">7. Third-Party Links</h3>
            <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices of these websites.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">8. Changes to This Policy</h3>
            <p>We may update this Privacy Policy periodically. Any changes will be posted here with an updated date.</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">9. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p className="mt-2">
              Email: <a href="mailto:info@boldandbeyondcoaching.ae" className="text-brand-teal hover:underline">info@boldandbeyondcoaching.ae</a><br />
              Phone: +971 58 889 7208
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
