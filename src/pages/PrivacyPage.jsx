
import { Shield, Eye, Database, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Shield className="mr-3 text-primary-500" size={32} />
              Privacy Policy
            </h1>
            <p className="text-gray-400">Last updated: February 2024</p>
          </div>

          <div className="prose prose-lg text-gray-300 max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                participate in tournaments, or contact us for support.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Personal information (name, email address, phone number)</li>
                <li>Gaming information (username, game preferences, statistics)</li>
                <li>Tournament participation data</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process tournament registrations and manage competitions</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about tournaments, events, and updates</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>With tournament organizers for legitimate tournament purposes</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of certain communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, 
                analyze usage patterns, and provide personalized content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@africariesports.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
