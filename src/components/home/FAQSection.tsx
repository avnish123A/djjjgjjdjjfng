import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const topFaqs = [
  {
    question: 'How long does delivery take?',
    answer:
      'Standard delivery takes 3–5 business days across India. Express delivery is available for metro cities with 1–2 day delivery for an additional fee.',
  },
  {
    question: 'Are all products genuine and brand new?',
    answer:
      'Yes, every product on EkamTech is 100% genuine and brand new. We are authorized resellers for all major brands including Apple, Samsung, OnePlus, Dell, HP, and more.',
  },
  {
    question: 'What is your return & warranty policy?',
    answer:
      'We offer a 7-day replacement policy for defective products. All electronics come with official manufacturer warranty. Extended warranty plans are also available at checkout.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Absolutely. All transactions are SSL-encrypted and processed through PCI-DSS compliant payment gateways. We support UPI, credit/debit cards, net banking, and COD.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium uppercase tracking-[5px] text-accent mb-4 block">
              Got Questions?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Frequently Asked
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Quick answers to the most common questions about orders, products, and delivery.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {topFaqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-2xl px-6 data-[state=open]:shadow-3d transition-shadow duration-300"
              >
                <AccordionTrigger className="text-sm sm:text-base font-medium text-left py-5 hover:no-underline hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent hover:gap-3 transition-all uppercase tracking-wider"
            >
              View All FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
