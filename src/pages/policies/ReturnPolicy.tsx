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
        <p>At EkamGift, we want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Return Window</h2>
          <p>We accept returns within <strong className="text-foreground">7 days</strong> of delivery. To be eligible for a return, the product must be:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unused, unworn, and in its original condition</li>
            <li>In the original packaging with all tags and labels attached</li>
            <li>Accompanied by the original invoice or order confirmation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. How to Initiate a Return</h2>
          <p>To start a return:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Email us at <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a> with your order number, product details, and reason for return</li>
            <li>Our team will review your request and respond within 24 hours</li>
            <li>Once approved, you'll receive return shipping instructions</li>
            <li>Pack the item securely and hand it to the pickup agent or ship via the provided method</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal care & beauty products (opened or used)</li>
            <li>Undergarments & innerwear</li>
            <li>Customised or personalised products (engraved, printed, etc.)</li>
            <li>Perishable items (food, flowers, cakes)</li>
            <li>Products marked as "Non-Returnable" on the product page</li>
            <li>Free gifts or promotional items</li>
            <li>Gift cards and vouchers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Refund Process</h2>
          <p>Once we receive and inspect the returned item, your refund will be processed within <strong className="text-foreground">5–7 business days</strong>:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Online Payments (UPI/Card/Net Banking):</strong> Refund to the original payment method</li>
            <li><strong className="text-foreground">COD Orders:</strong> Refund via bank transfer (NEFT/IMPS) — we'll collect your bank details</li>
            <li><strong className="text-foreground">Wallet Payments:</strong> Refund to the source wallet</li>
          </ul>
          <p className="mt-2">Please allow additional 3–5 business days for the refund to reflect in your account depending on your bank.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Exchange</h2>
          <p>Direct exchanges are available for size or colour issues, subject to stock availability. To request an exchange, contact us within 7 days of delivery at <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Damaged or Wrong Products</h2>
          <p>If you receive a damaged, defective, or incorrect product:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact us within <strong className="text-foreground">48 hours</strong> of delivery with photos of the product and packaging</li>
            <li>We will arrange a <strong className="text-foreground">free pickup</strong> and send a replacement or issue a full refund</li>
            <li>No return shipping charges apply in this case</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Return Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Defective/Wrong items:</strong> Free return shipping</li>
            <li><strong className="text-foreground">Change of mind:</strong> A flat fee of ₹99 will be deducted from the refund amount</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Cancellations</h2>
          <p>Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible — you may initiate a return after delivery instead. To cancel, email us with your order number as soon as possible.</p>
        </section>
      </div>
    </div>
  </main>
);

export default ReturnPolicy;
