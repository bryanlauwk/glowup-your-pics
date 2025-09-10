import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Will she notice this is AI magic? 💕",
    answer: "Not at all, darling! Our invisible love magic makes subtle, enchanting improvements that enhance your natural charm without looking fake. The changes are completely undetectable - she'll just think you look absolutely irresistible ✨"
  },
  {
    question: "How natural and dreamy do I look? 🌙",
    answer: "Like you're living in a romantic movie! We enhance your existing magnetism rather than changing who you are. Think of it as your most confident, attractive self on the most perfect day - but still authentically, beautifully you 💫"
  },
  {
    question: "Will I still look strong and charming? 💪",
    answer: "Absolutely, gorgeous! Our AI is designed to amplify your natural masculine appeal - stronger jawlines, confident presence, irresistible charm. You'll look more attractive while maintaining that magnetic, masculine energy she craves 🔥"
  },
  {
    question: "Does this work for all beautiful souls? 🌍",
    answer: "Yes, sweetie! Our AI celebrates all forms of beauty and works enchantingly well for all ethnicities. We've helped thousands of amazing souls find their perfect match, no matter their background 💖"
  },
  {
    question: "How quickly will I receive my love transformation? ⏰",
    answer: "Your magical transformation happens in just 5-10 minutes! Premium lovers get priority processing for even faster results. You'll receive a sweet notification when your enchanted photos are ready 📱✨"
  },
  {
    question: "Can I spread this love magic everywhere? 📱",
    answer: "Absolutely, love! Your enchanted photos work like magic on Tinder, Bumble, Hinge, Coffee Meets Bagel, Match, OkCupid, and every dating platform. The love improvements are designed to make hearts flutter everywhere 💕"
  },
  {
    question: "What if my heart doesn't find its match? 💔",
    answer: "Don't worry, darling! We offer a 100% love guarantee. If you're not finding your soulmate within 30 days, we'll refund every penny, no questions asked. Your happiness is our greatest joy 💝"
  },
  {
    question: "Are my photos safe in your loving hands? 🛡️",
    answer: "Completely safe, sweetheart! We use the strongest protection to guard your precious photos. Your originals are automatically deleted after 30 days, and we never, ever share your beautiful images with anyone else 🔐💕"
  }
];

export const FAQSection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-background via-enchanting-purple/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent">
              💕 Love Questions & Sweet Answers 💕
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything your heart needs to know about SwipeBoost ✨
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
                <AccordionTrigger className="text-left font-semibold text-lg hover:text-love-pink transition-colors">
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
              Still have questions, sweetie?{' '}
              <span className="text-love-pink font-semibold hover:underline cursor-pointer">
                Chat with our love experts 💕
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};