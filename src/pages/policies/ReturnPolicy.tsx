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
        <p>At EkamGift, we want every gift to bring joy. If something isn't right with your order, we're here to make it better. Please read our return and refund policy carefully.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Return Window</h2>
          <p>We accept returns within <strong className="text-foreground">7 days</strong> of delivery. To be eligible for a return, the product must be:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unused, unworn, and in its original condition</li>
            <li>In the original gift packaging with all tags and labels attached</li>
            <li>Accompanied by the order confirmation or invoice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Non-Returnable Items</h2>
          <p>As a gift shop, certain items <strong className="text-foreground">cannot be returned</strong> due to their nature:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Personalised / Custom Gifts</strong> — Engraved, printed, or custom-made items</li>
            <li><strong className="text-foreground">Perishable Items</strong> — Food hampers, chocolates, cakes, fresh flowers</li>
            <li><strong className="text-foreground">Personal Care & Beauty</strong> — Opened or used skincare, perfumes, cosmetics</li>
            <li><strong className="text-foreground">Intimate Apparel</strong> — Undergarments and innerwear</li>
            <li><strong className="text-foreground">Gift Cards & Vouchers</strong> — Digital or physical gift cards</li>
            <li><strong className="text-foreground">Promotional / Free Gifts</strong> — Items received as part of an offer</li>
            <li><strong className="text-foreground">Items marked "Non-Returnable"</strong> on the product page</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Email us at <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a> with your order number, product photos, and reason for return</li>
            <li>Our team will review your request and respond within <strong className="text-foreground">24–48 hours</strong></li>
            <li>Once approved, you'll receive return shipping instructions or a pickup will be arranged</li>
            <li>Pack the item securely in its original packaging</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Refund Process</h2>
          <p>Once we receive and inspect the returned item, your refund will be processed:</p>
          <div className="border border-border rounded-lg overflow-hidden mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-3 font-medium text-foreground">Payment Method</th>
                  <th className="text-left p-3 font-medium text-foreground">Refund Mode</th>
                  <th className="text-left p-3 font-medium text-foreground">Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3">UPI / Card / Net Banking</td>
                  <td className="p-3">Original payment method</td>
                  <td className="p-3 font-medium">5–7 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Cash on Delivery</td>
                  <td className="p-3">Bank transfer (NEFT/IMPS)</td>
                  <td className="p-3 font-medium">7–10 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Wallet Payments</td>
                  <td className="p-3">Source wallet</td>
                  <td className="p-3 font-medium">3–5 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">Please allow additional 3–5 business days for the refund to reflect in your account depending on your bank or payment provider.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Exchange Policy</h2>
          <p>We offer exchanges for size, colour, or variant issues — subject to stock availability:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exchange requests must be made within <strong className="text-foreground">7 days</strong> of delivery</li>
            <li>The item must be in original, unused condition</li>
            <li>If the exchanged product has a price difference, additional payment or refund will be adjusted</li>
            <li>Personalised and perishable items are <strong className="text-foreground">not eligible</strong> for exchange</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Damaged, Defective, or Wrong Products</h2>
          <p>If your gift arrives damaged, defective, or is the wrong item:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact us within <strong className="text-foreground">48 hours</strong> of delivery with clear photos of the product and packaging</li>
            <li>We will arrange a <strong className="text-foreground">free pickup</strong> and send a replacement or issue a full refund — your choice</li>
            <li>No return shipping charges apply</li>
            <li>For gift orders sent to someone else, the recipient or sender can report the issue</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Return Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Damaged / Wrong items:</strong> Free return shipping (our responsibility)</li>
            <li><strong className="text-foreground">Change of mind:</strong> A flat fee of ₹99 will be deducted from the refund amount</li>
            <li><strong className="text-foreground">Quality issues:</strong> Free return shipping after verification</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Cancellations</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders can be cancelled before they are shipped — email us with your order number ASAP</li>
            <li>Personalised / custom orders can only be cancelled within <strong className="text-foreground">2 hours</strong> of placing the order, as production begins immediately</li>
            <li>Once shipped, cancellation is not possible — initiate a return after delivery</li>
            <li>Refunds for cancelled orders are processed within 3–5 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact Us</h2>
          <p>For return or refund queries, reach out to us:</p>
          <p><strong className="text-foreground">EkamGift Support</strong><br/>
          Email: <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a><br/>
          Phone: +91 98765 43210<br/>
          Response Time: Within 24 hours on business days</p>
        </section>
      </div>
    </div>
  </main>
);

export default ReturnPolicy;
