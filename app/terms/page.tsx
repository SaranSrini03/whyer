'use client';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Background glow */}
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
        <h1 className="text-4xl font-light mb-4 text-yellow-400">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Effective Date: June 16, 2025</p>

        <section className="space-y-8 text-gray-300 text-sm leading-6">
          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By using Whyer, you agree to these terms and our Privacy Policy. If you disagree, please do not use the service.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">2. Use of Service</h2>
            <p>You must be at least 13 years old to use Whyer. You agree not to misuse the platform, impersonate others, or violate applicable laws.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">3. Account Responsibility</h2>
            <p>You are responsible for your account activity. Keep your credentials safe and notify us of unauthorized use immediately.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">4. Content Ownership</h2>
            <p>You retain rights to the content you post. However, by posting on Whyer, you grant us a license to display, distribute, and promote your content within the app.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">5. User Conduct</h2>
            <p>No hate speech, harassment, illegal content, or spamming. Violations may lead to suspension or account termination.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">6. Termination</h2>
            <p>We reserve the right to suspend or delete accounts at our discretion, especially in cases of abuse or violations of these terms.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">7. Limitation of Liability</h2>
            <p>Whyer is provided "as-is." We are not liable for indirect damages, data loss, or service interruptions.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">8. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We'll notify you of significant changes, but continued use means you accept the new terms.</p>
          </div>

          <div>
            <h2 className="text-yellow-500 text-base font-semibold mb-2">9. Contact</h2>
            <p>Questions? Reach out at <a href="mailto:support@whyer.app" className="text-yellow-400 underline">support@whyer.app</a>.</p>
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
