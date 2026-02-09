import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => (
  <main className="min-h-screen">
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Privacy Policy</span>
      </nav>
    </div>
    <div className="container mx-auto px-4 pb-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p><strong className="text-foreground">Last Updated:</strong> February 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect personal information you provide when placing orders, creating accounts, or contacting us. This includes your name, email address, phone number, shipping address, and payment details.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <p>We use your information to process orders, deliver products, send order updates via email/SMS, improve our services, and comply with legal obligations under Indian law.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Security</h2>
          <p>We implement industry-standard SSL encryption and secure payment gateways (Razorpay, Cashfree) to protect your data. We do not store your complete card details on our servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Sharing</h2>
          <p>We share your information only with delivery partners and payment processors necessary to fulfill your orders. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Cookies</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>Under the Digital Personal Data Protection Act (DPDPA) 2023, you have the right to access, correct, or delete your personal data. Contact us at support@luxestore.in to exercise your rights.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact Us</h2>
          <p>For privacy-related concerns, reach us at:<br/>Email: support@luxestore.in<br/>Phone: +91 98765 43210</p>
        </section>
      </div>
    </div>
  </main>
);

export default PrivacyPolicy;
