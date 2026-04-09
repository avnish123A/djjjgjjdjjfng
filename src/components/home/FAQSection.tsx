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
    question: 'How do you ensure freshness?',
    answer: 'All oils and spices are shipped within weeks of harvest or pressing. Our cold chain logistics maintain optimal temperature from producer to your doorstep.',
  },
  {
    question: 'Are these products genuinely single-origin?',
    answer: 'Yes. Every product on Terroir & Co. comes with full traceability — including origin coordinates, harvest date, and producer information.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 14-day satisfaction guarantee. If a product doesn\'t meet your expectations, we\'ll replace it or provide a full refund.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we deliver across India with complimentary shipping on orders above ₹5,000. International shipping is coming soon.',
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
