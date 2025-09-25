
import { FileText, Shield, Users, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <FileText className="mr-3 text-primary-500" size={32} />
              Terms of Service
            </h1>
            <p className="text-gray-400">Last updated: February 2024</p>
          </div>

          <div className="prose prose-lg text-gray-300 max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Africa Rise Esports platform, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of Africa Rise Esports materials 
                for personal, non-commercial transitory viewing only. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Tournament Participation</h2>
              <p>
                By participating in tournaments hosted on our platform, you agree to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Follow all tournament rules and regulations</li>
                <li>Compete fairly and with good sportsmanship</li>
                <li>Not use any unauthorized software or cheats</li>
                <li>Accept the decisions of tournament organizers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Prohibited Uses</h2>
              <p>You may not use our platform:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>For any unlawful purpose or to solicit others to perform illegal acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please refer to our Privacy Policy which also governs 
                your use of the platform, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at 
                legal@africariesports.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
