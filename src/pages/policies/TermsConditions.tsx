import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TermsConditions = () => (
  <main className="min-h-screen">
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Terms & Conditions</span>
      </nav>
    </div>
    <div className="container mx-auto px-4 pb-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p><strong className="text-foreground">Last Updated:</strong> February 2026</p>
        <p>Welcome to EkamGift. By accessing and using our website <strong className="text-foreground">ekamgift.com</strong>, you agree to be bound by these Terms & Conditions. Please read them carefully before making any purchase.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. About EkamGift</h2>
          <p>EkamGift is an online gifting and lifestyle store offering curated products across categories including fashion, electronics, home & living, personalised gifts, and more. We are committed to delivering joy through thoughtfully selected products.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Eligibility</h2>
          <p>You must be at least 18 years old to make a purchase on EkamGift. By placing an order, you confirm that you are legally capable of entering into binding contracts under Indian law.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Products & Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable GST</li>
            <li>We reserve the right to modify prices without prior notice</li>
            <li>Product images are for illustration purposes and may vary slightly from actual products</li>
            <li>Product availability is subject to stock and may change without notice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Orders & Payment</h2>
          <p>Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order due to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Product unavailability or pricing errors</li>
            <li>Suspected fraudulent activity</li>
            <li>Incomplete or incorrect order information</li>
          </ul>
          <p className="mt-2">We accept payments via UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery (COD). All online transactions are processed through secure, PCI-DSS compliant payment gateways.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Delivery</h2>
          <p>We deliver across India. Standard delivery takes 3–7 business days depending on your location. Free delivery is available on orders above ₹999. For detailed information, please refer to our <Link to="/policies/shipping" className="text-primary hover:underline">Shipping Policy</Link>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Returns & Refunds</h2>
          <p>Returns are accepted within 7 days of delivery subject to our conditions. For complete details, please refer to our <Link to="/policies/returns" className="text-primary hover:underline">Return & Refund Policy</Link>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Intellectual Property</h2>
          <p>All content on this website — including the EkamGift name, logo, images, text, product descriptions, and design elements — are the property of EkamGift and are protected under Indian copyright and trademark laws. Unauthorised use is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to interfere with the website's functionality</li>
            <li>Submit false or misleading information</li>
            <li>Resell products purchased from EkamGift for commercial purposes without authorisation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Limitation of Liability</h2>
          <p>EkamGift shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid by you for the relevant order.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">10. Governing Law & Disputes</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India. We encourage you to contact us first at <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a> to resolve any issues amicably.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">11. Changes to Terms</h2>
          <p>EkamGift reserves the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the website constitutes acceptance of the revised terms.</p>
        </section>
      </div>
    </div>
  </main>
);

export default TermsConditions;
