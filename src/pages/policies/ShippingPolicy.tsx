import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ShippingPolicy = () => (
  <main className="min-h-screen">
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Shipping Policy</span>
      </nav>
    </div>
    <div className="container mx-auto px-4 pb-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <p><strong className="text-foreground">Last Updated:</strong> February 2026</p>
        <p>At EkamGift, we strive to deliver your gifts and products safely and on time. Here's everything you need to know about our shipping process.</p>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Delivery Areas</h2>
          <p>We currently deliver to all serviceable pin codes across India. Enter your PIN code at checkout to verify delivery availability in your area. We do not offer international shipping at this time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Delivery Timeline</h2>
          <p>Estimated delivery times after order confirmation:</p>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-3 font-medium text-foreground">Location</th>
                  <th className="text-left p-3 font-medium text-foreground">Estimated Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3">Metro Cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad)</td>
                  <td className="p-3">2–4 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Tier 2 Cities (Jaipur, Lucknow, Chandigarh, etc.)</td>
                  <td className="p-3">4–6 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Other Locations</td>
                  <td className="p-3">5–8 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">North-East & Remote Areas</td>
                  <td className="p-3">7–10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">*Delivery timelines may vary during festive seasons, sales events, or due to unforeseen circumstances.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Free Delivery:</strong> On all prepaid orders above ₹999</li>
            <li><strong className="text-foreground">Standard Shipping:</strong> ₹99 for orders below ₹999</li>
            <li><strong className="text-foreground">Express Delivery:</strong> Available in select metro cities at ₹199 (1–2 business days)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Order Processing</h2>
          <p>Orders are processed within 1–2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day. You will receive an email and SMS confirmation once your order is dispatched.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Order Tracking</h2>
          <p>Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order in real-time using our <Link to="/track-order" className="text-primary hover:underline">Order Tracking</Link> page or directly on the courier partner's website.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Cash on Delivery (COD)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>COD is available on orders up to ₹10,000</li>
            <li>Please keep exact change ready at the time of delivery</li>
            <li>COD orders are verified via OTP before dispatch</li>
            <li>A nominal COD handling fee may apply on select orders</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Gift Packaging</h2>
          <p>All EkamGift orders come in premium, gift-ready packaging at no extra charge. If you're sending a gift, you can add a personalised message during checkout. The invoice will not be included in the package for gift orders.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Undelivered Orders</h2>
          <p>If a delivery attempt fails, our courier partner will make up to 2 additional attempts. If all attempts are unsuccessful:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The order will be returned to our warehouse</li>
            <li>For prepaid orders: A full refund will be initiated within 5–7 business days</li>
            <li>For COD orders: No charges will be applied</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Contact Us</h2>
          <p>For shipping-related queries, reach out to us at:</p>
          <p><strong className="text-foreground">EkamGift Support</strong><br/>
          Email: <a href="mailto:support@ekamgift.com" className="text-primary hover:underline">support@ekamgift.com</a><br/>
          Phone: +91 98765 43210</p>
        </section>
      </div>
    </div>
  </main>
);

export default ShippingPolicy;
