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
    answer: 'Standard delivery takes 3–5 business days across India. Express delivery is available for metro cities with 1–2 day delivery.',
  },
  {
    question: 'Are all products genuine and brand new?',
    answer: 'Yes, every product on EkamTech is 100% genuine and brand new. We are authorized resellers for all major brands.',
  },
  {
    question: 'What is your return & warranty policy?',
    answer: 'We offer a 7-day replacement policy for defective products. All electronics come with official manufacturer warranty.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely. All transactions are SSL-encrypted and processed through PCI-DSS compliant payment gateways.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-xl sm:text-2xl tracking-tight">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {topFaqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-lg px-4 data-[state=open]:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-sm font-medium text-left py-4 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-6">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              View All FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
