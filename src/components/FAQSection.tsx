import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Is this AI enhancement detectable?",
    answer: "No! Our advanced AI makes subtle, natural improvements that enhance your best features without looking fake or overly edited. The changes are completely undetectable to dating app algorithms and real people."
  },
  {
    question: "How long does it take to get my enhanced photos?",
    answer: "Most photos are processed within 5-10 minutes. Pro and Elite customers get priority processing for even faster results. You'll receive an email notification when your photos are ready for download."
  },
  {
    question: "What if I don't like the results?",
    answer: "We offer a 100% money-back guarantee. If you're not completely satisfied with your enhanced photos, we'll refund your purchase within 30 days, no questions asked."
  },
  {
    question: "Can I use these photos on all dating apps?",
    answer: "Absolutely! Your enhanced photos work perfectly on Tinder, Bumble, Hinge, Coffee Meets Bagel, Match, OkCupid, and any other dating platform. The improvements are designed to perform well across all apps."
  },
  {
    question: "How does the AI enhancement work?",
    answer: "Our AI analyzes facial features, lighting, skin tone, and facial structure to make subtle improvements like smoothing skin, enhancing jawlines, brightening eyes, and optimizing lighting - all while maintaining your natural appearance."
  },
  {
    question: "What photo formats do you accept?",
    answer: "We accept JPG, PNG, and HEIC formats. Photos should be at least 500x500 pixels for best results. Portrait orientation works best, but we can enhance landscape photos too."
  },
  {
    question: "Is my data and photos secure?",
    answer: "Yes, absolutely. We use enterprise-grade encryption to protect your photos and data. Your original photos are automatically deleted from our servers after 30 days, and we never share your images with third parties."
  },
  {
    question: "Can I get multiple versions of the same photo?",
    answer: "With our Pro and Elite plans, you can request different enhancement styles for the same photo. This lets you test which version performs better on your dating profiles."
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