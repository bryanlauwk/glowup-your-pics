import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Will women notice the AI enhancement?",
    answer: "No! Our advanced AI makes subtle, natural improvements that enhance your masculine features without looking fake or overly edited. The changes are completely undetectable to dating app algorithms and women - they'll just think you look amazing."
  },
  {
    question: "How natural do the changes look?",
    answer: "Extremely natural. We enhance your existing features rather than changing them. Think of it as your best self on your best day - more confidence, better lighting, sharper jawline - but still authentically you."
  },
  {
    question: "Will I still look masculine and strong?",
    answer: "Absolutely! Our AI is specifically designed to enhance masculine features like jawlines, facial structure, and confidence. We make you look more attractive while maintaining your natural masculine appeal."
  },
  {
    question: "Does this work for Asian men and other ethnicities?",
    answer: "Yes! Our AI is trained on diverse datasets and works exceptionally well for all ethnicities. We've helped thousands of Asian men, Black men, Latino men, and men of all backgrounds get better matches."
  },
  {
    question: "How long does it take to get my enhanced photos?",
    answer: "Most photos are processed within 5-10 minutes. Pro and Elite customers get priority processing for even faster results. You'll receive an email notification when your photos are ready for download."
  },
  {
    question: "Can I use these photos on all dating apps?",
    answer: "Absolutely! Your enhanced photos work perfectly on Tinder, Bumble, Hinge, Coffee Meets Bagel, Match, OkCupid, and any other dating platform. The improvements are designed to perform well across all apps."
  },
  {
    question: "What if I don't get better results?",
    answer: "We offer a 100% money-back guarantee. If you're not getting more quality matches within 30 days, we'll refund your purchase, no questions asked. Your success is our success."
  },
  {
    question: "Is my data and photos secure?",
    answer: "Yes, absolutely. We use enterprise-grade encryption to protect your photos and data. Your original photos are automatically deleted from our servers after 30 days, and we never share your images with third parties."
  }
];

export const FAQSection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-background via-deep-purple/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about SwipeBoost
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-violet-purple transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="text-center space-y-4 pt-8">
            <p className="text-lg text-muted-foreground">
              Still have questions?{' '}
              <span className="text-violet-purple font-semibold hover:underline cursor-pointer">
                Contact our support team
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};