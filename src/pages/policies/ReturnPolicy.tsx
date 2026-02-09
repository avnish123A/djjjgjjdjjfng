import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ReturnPolicy = () => (
  <main className="min-h-screen">
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Return & Refund Policy</span>
      </nav>
    </div>
    <div className="container mx-auto px-4 pb-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Return & Refund Policy</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p><strong className="text-foreground">Last Updated:</strong> February 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Return Window</h2>
          <p>We accept returns within 7 days of delivery. The product must be unused, unworn, and in its original packaging with all tags attached.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How to Initiate a Return</h2>
          <p>To initiate a return, contact us at support@luxestore.in with your order number and reason for return. Our team will provide you with return instructions within 24 hours.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal care & beauty products (opened/used)</li>
            <li>Undergarments & innerwear</li>
            <li>Customised or personalised products</li>
            <li>Products marked as "Non-Returnable"</li>
            <li>Free gifts or promotional items</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Refund Process</h2>
          <p>Once we receive and inspect the returned item, refunds will be processed within 5-7 business days:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Online payment:</strong> Refund to original payment method</li>
            <li><strong className="text-foreground">COD orders:</strong> Refund via bank transfer (NEFT/IMPS)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Exchange</h2>
          <p>Direct exchanges are available for size/colour issues. Contact support within 7 days of delivery. Exchange is subject to stock availability.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Damaged or Wrong Products</h2>
          <p>If you receive a damaged or incorrect product, contact us immediately with photos. We will arrange a free pickup and send a replacement or full refund.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Return Shipping</h2>
          <p>For returns due to product defects or wrong items, return shipping is free. For other reasons, a flat fee of ₹99 will be deducted from the refund amount.</p>
        </section>
      </div>
    </div>
  </main>
);

export default ReturnPolicy;
