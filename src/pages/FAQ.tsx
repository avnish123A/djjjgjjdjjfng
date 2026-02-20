import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Orders & Delivery',
    faqs: [
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 3–5 business days across India. Express delivery (1–2 days) is available for select pin codes.',
      },
      {
        question: 'Do you offer free shipping?',
        answer:
          'Yes! Orders above ₹999 qualify for free standard shipping across India. No coupon code needed.',
      },
      {
        question: 'Can I track my order?',
        answer:
          'Once shipped, you\'ll receive a tracking number via email. You can also track your order on our Track Order page using your order number and email.',
      },
      {
        question: 'Do you deliver internationally?',
        answer:
          'Currently we deliver across India only. International shipping is coming soon - subscribe to our newsletter for updates.',
      },
    ],
  },
  {
    title: 'Payments',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept UPI, credit/debit cards (Visa, Mastercard, RuPay), net banking, wallets (Paytm, PhonePe), and Cash on Delivery.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'All transactions are SSL-encrypted and processed through PCI-DSS compliant gateways. We never store your card details.',
      },
      {
        question: 'Is Cash on Delivery available?',
        answer:
          'Yes, COD is available for orders above the minimum order value. A small handling fee may apply and will be shown at checkout.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    faqs: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a hassle-free 7-day return policy from the date of delivery. Items must be unused, in original packaging, and with all tags intact.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Contact our support team at support@ekamgift.com with your order number. We\'ll arrange a pickup or provide return shipping instructions.',
      },
      {
        question: 'How long do refunds take?',
        answer:
          'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    title: 'Gifts & Personalization',
    faqs: [
      {
        question: 'Can I add a gift message?',
        answer:
          'Yes! You can add a personalized gift message during checkout. It will be printed on a premium card and included with your order.',
      },
      {
        question: 'Do you offer gift wrapping?',
        answer:
          'Every order comes with premium gift packaging at no extra charge. We believe every gift deserves a beautiful presentation.',
      },
      {
        question: 'Can I personalize or engrave products?',
        answer:
          'Select products support custom engraving and personalization. Look for the "Personalize" option on the product page.',
      },
    ],
  },
  {
    title: 'Account & Support',
    faqs: [
      {
        question: 'How can I contact customer support?',
        answer:
          'Email us at support@ekamgift.com. Our team is available Monday–Saturday, 10 AM – 7 PM IST. We typically respond within 24 hours.',
      },
      {
        question: 'Do I need an account to place an order?',
        answer:
          'No, you can checkout as a guest. However, creating an account lets you track orders and save your details for faster checkout.',
      },
    ],
  },
];

const FAQ = () => {
  return (
    <main className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[11px] font-medium uppercase tracking-[5px] text-primary mb-4 block">
              Help Center
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
              FAQs
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Everything you need to know about shopping with EkamGift. Can't find what you're looking for? Reach out to our support team.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqCategories.map((cat) => (
              <div key={cat.title}>
                <h2 className="font-display text-xl sm:text-2xl mb-5 tracking-tight">
                  {cat.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {cat.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`${cat.title}-${i}`}
                      className="border border-border rounded-2xl px-6 data-[state=open]:shadow-3d transition-shadow duration-300"
                    >
                      <AccordionTrigger className="text-sm sm:text-base font-medium text-left py-5 hover:no-underline hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center p-10 rounded-2xl bg-secondary/50 border border-border">
            <h3 className="font-display text-xl mb-2">Still have questions?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Our team is happy to help you with anything.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-[2px] hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
