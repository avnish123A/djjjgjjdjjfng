import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
              <HelpCircle className="h-3.5 w-3.5" />
              Got Questions?
            </div>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight">Frequently Asked Questions</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-3">
            {topFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="border border-border/60 rounded-xl px-5 data-[state=open]:shadow-md data-[state=open]:border-primary/20 transition-all"
                >
                  <AccordionTrigger className="text-sm font-medium text-left py-5 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/faq"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              View All FAQs <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
