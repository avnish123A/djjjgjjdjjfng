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

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. General</h2>
          <p>By accessing and using LUXE (luxestore.in), you agree to be bound by these terms and conditions. These terms are governed by the laws of India.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Products & Pricing</h2>
          <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable GST. We reserve the right to modify prices without prior notice. Product images are for illustration purposes and may differ slightly from actual products.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Orders</h2>
          <p>Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order. Orders are subject to product availability and payment verification.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Payment</h2>
          <p>We accept payments via Razorpay, Cashfree (UPI, Credit/Debit Cards, Net Banking, Wallets), and Cash on Delivery (COD). All online transactions are processed through secure, PCI-DSS compliant payment gateways.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Delivery</h2>
          <p>We deliver across India. Standard delivery takes 3-7 business days depending on your location. Free delivery is available on orders above ₹999.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Intellectual Property</h2>
          <p>All content on this website including logos, images, text, and design elements are the property of LUXE and are protected under Indian copyright and trademark laws.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>LUXE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Dispute Resolution</h2>
          <p>Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India.</p>
        </section>
      </div>
    </div>
  </main>
);

export default TermsConditions;
