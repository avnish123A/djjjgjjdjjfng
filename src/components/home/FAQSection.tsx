import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const topFaqs = [
  {
    question: 'Are all products on CartZebra genuine?',
    answer: 'Yes. Every product is sourced from trusted brands and verified sellers, and checked before it is shipped to you.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Most orders are delivered within 7–14 days. You can track your order any time from the Track Order page.',
  },
  {
    question: 'What is your return policy?',
    answer: 'Eligible products can be returned within 7 days of delivery. See our Return & Refund policy for details.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, Cash on Delivery is available on eligible PIN codes, along with UPI, cards and net banking.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-16 lg:py-24 border-t border-foreground/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-utility text-[10px] tracking-[0.3em] text-foreground/40 mb-3">QUESTIONS</p>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tighter">Frequently Asked</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-0">
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
                  className="border-b border-foreground/8 py-1"
                >
                  <AccordionTrigger className="text-sm font-medium text-left py-5 hover:no-underline hover:text-primary transition-colors font-display tracking-tight">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-6">
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
            className="text-center mt-10"
          >
            <Link
              to="/faq"
              className="group inline-flex items-center gap-3 font-utility text-[10px] tracking-[0.2em] text-foreground border-b border-foreground/20 pb-1 hover:border-foreground transition-colors duration-500"
            >
              ALL QUESTIONS
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
