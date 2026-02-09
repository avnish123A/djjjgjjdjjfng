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

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Delivery Areas</h2>
          <p>We currently deliver to all serviceable pin codes across India. Enter your PIN code at checkout to verify delivery availability in your area.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Delivery Timeline</h2>
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
                  <td className="p-3">Metro Cities (Mumbai, Delhi, Bangalore, etc.)</td>
                  <td className="p-3">2-4 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Tier 2 Cities</td>
                  <td className="p-3">4-6 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Other Locations</td>
                  <td className="p-3">5-8 business days</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">North-East & Remote Areas</td>
                  <td className="p-3">7-10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Free Delivery:</strong> On orders above ₹999</li>
            <li><strong className="text-foreground">Standard Shipping:</strong> ₹99 for orders below ₹999</li>
            <li><strong className="text-foreground">Express Delivery:</strong> Available in select cities at ₹199</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Order Tracking</h2>
          <p>Once your order is shipped, you'll receive a tracking number via email and SMS. Use this to track your delivery status in real-time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Cash on Delivery (COD)</h2>
          <p>COD is available on orders up to ₹10,000. Please keep exact change ready at the time of delivery. COD orders are verified via OTP before dispatch.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Undelivered Orders</h2>
          <p>If a delivery attempt fails, our courier partner will make 2 more attempts. If all attempts fail, the order will be returned to our warehouse and a refund will be initiated.</p>
        </section>
      </div>
    </div>
  </main>
);

export default ShippingPolicy;
