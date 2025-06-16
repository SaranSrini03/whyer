'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Yellow background glow */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-300px] left-[-300px] w-[800px] h-[800px] bg-gradient-to-r from-yellow-900/10 to-yellow-700/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-400px] right-[-300px] w-[700px] h-[700px] bg-gradient-to-r from-yellow-800/15 to-yellow-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fde047' stroke-width='0.7'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-3xl mx-auto py-20 px-4 sm:px-6">
        <h1 className="text-4xl font-light mb-4 text-yellow-400">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Effective Date: June 16, 2025</p>

        <section className="space-y-8 text-gray-300 text-sm leading-6">
          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">1. Information We Collect</h2>
            <p>We collect your name, username, email, date of birth, and encrypted password when you sign up. We may also collect browser/device information and IP address for analytics and security purposes.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use your data to create your account, personalize your experience, communicate with you, and improve Whyer. We do not sell your data.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">3. Sharing of Information</h2>
            <p>Your data is not shared except with trusted providers (e.g. hosting, analytics) or as required by law. You control what profile info you make public.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">4. Data Security</h2>
            <p>We use industry-standard encryption, secured infrastructure, and regular audits to keep your data safe.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">5. Cookies & Tracking</h2>
            <p>We use cookies to remember login sessions, improve usability, and analyze usage. You may disable cookies in your browser settings.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">6. Your Rights</h2>
            <ul className="list-disc ml-6">
              <li>Access or export your data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>Contact us at <a href="mailto:support@whyer.app" className="text-yellow-400 underline">support@whyer.app</a> to exercise your rights.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">7. Children’s Privacy</h2>
            <p>Whyer is not intended for users under the age of 13. We do not knowingly collect data from children.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">8. Changes to This Policy</h2>
            <p>We may update this policy. Significant changes will be notified via email or in-app alerts.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">9. Contact Us</h2>
            <p>For any questions or concerns:</p>
            <p>Email: <a href="mailto:support@whyer.app" className="text-yellow-400 underline">support@whyer.app</a></p>
          </div>
        </section>

        <div className="mt-12 text-sm text-gray-500">
          <Link href="/" className="text-yellow-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
