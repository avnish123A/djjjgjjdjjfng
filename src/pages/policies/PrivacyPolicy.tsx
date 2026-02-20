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
        <p>EkamGift ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong className="text-foreground">ekamgift.com</strong> or place an order with us.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect the following personal information when you interact with EkamGift:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Personal Details:</strong> Name, email address, phone number, and shipping/billing address</li>
            <li><strong className="text-foreground">Payment Information:</strong> Payment method details processed securely through our payment partners</li>
            <li><strong className="text-foreground">Order Details:</strong> Products purchased, order history, gift messages, and preferences</li>
            <li><strong className="text-foreground">Device & Usage Data:</strong> IP address, browser type, pages visited, and interaction patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill your orders, including gift wrapping and personalised messages</li>
            <li>Send order confirmations, shipping updates via email and SMS</li>
            <li>Provide customer support and respond to enquiries</li>
            <li>Improve our website, product offerings, and user experience</li>
            <li>Send promotional offers and newsletters (only with your consent)</li>
            <li>Prevent fraud and ensure secure transactions</li>
            <li>Comply with applicable Indian laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits. We do not store your complete card details on our servers. All payment processing is handled by PCI-DSS compliant third-party providers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Sharing</h2>
          <p>We share your information only with trusted partners necessary to fulfill your orders:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Delivery Partners:</strong> To ship your orders to the correct address</li>
            <li><strong className="text-foreground">Payment Processors:</strong> To securely process your payments</li>
            <li><strong className="text-foreground">Analytics Providers:</strong> To understand and improve site performance</li>
          </ul>
          <p className="mt-2">We do <strong className="text-foreground">not</strong> sell, trade, or rent your personal data to third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Cookies & Tracking</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, maintain your shopping cart, and analyse site traffic. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>Under the Digital Personal Data Protection Act (DPDPA) 2023 and applicable Indian laws, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access and review your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Lodge a grievance with the Data Protection Board of India</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to fulfill orders, provide customer support, and comply with legal obligations. Order records are retained for a minimum of 8 years as required under Indian tax and commerce regulations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact Us</h2>
          <p>For privacy-related concerns or to exercise your rights, contact us at:</p>
          <p><strong className="text-foreground">EkamGift</strong><br/>
          Email: <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a><br/>
          Phone: +91 98765 43210<br/>
          Address: India</p>
        </section>
      </div>
    </div>
  </main>
);

export default PrivacyPolicy;
