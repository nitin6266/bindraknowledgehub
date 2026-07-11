"use client";

import { ChevronDown, MessageSquare } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Do you offer online classes?",
    answer: "Yes, we offer both online and offline classes. Our online classes are live, interactive sessions with the same faculty who teach in our physical classrooms. Students can ask questions in real-time, participate in discussions, and access recorded sessions for revision. We also provide digital study materials and online test series.",
  },
  {
    question: "Do you conduct regular tests?",
    answer: "Yes, regular assessments are a core part of our methodology. We conduct weekly concept checks, monthly comprehensive tests, and full-length mock exams for board and competitive exams. Detailed performance analysis is shared with students and parents after each test.",
  },
  {
    question: "Can parents track their child's progress?",
    answer: "Absolutely. We provide monthly progress reports with detailed subject-wise analysis. Parents can also access our online portal anytime to view test scores, attendance, and teacher feedback. We also hold quarterly parent-teacher meetings (online/offline) for in-depth discussions.",
  },
  {
    question: "Do you offer demo classes?",
    answer: "Yes, we offer a complimentary demo class so students and parents can experience our teaching methodology firsthand. You can book a demo class through our website or by calling our admissions team. The demo class is conducted by the same faculty who would teach the regular batch.",
  },
  {
    question: "How are batches organized?",
    answer: "Batches are organized by grade, subject, and learning level. We maintain small batch sizes (typically 8–12 students) to ensure personalized attention. Students are placed in batches based on their current academic level, learning pace, and goals. Separate batches are available for board exams and competitive exams (JEE/NEET).",
  },
  {
    question: "How can I enroll my child?",
    answer: "Enrollment is simple: 1) Book a free assessment through our website or call us, 2) Our academic counsellor will discuss your child's needs and recommend the best program, 3) Choose between online/offline and batch timings, 4) Complete the admission formalities. Our team assists you at every step.",
  },
  {
    question: "What is the fee structure?",
    answer: "Our fee structure varies by program, grade, and learning mode (online/offline). We offer flexible payment options including monthly, quarterly, and annual plans. Scholarships and sibling discounts are available. Contact our admissions team for a detailed fee breakdown specific to your child's program.",
  },
  {
    question: "Do you provide study material?",
    answer: "Yes, we provide comprehensive study material including concept notes, practice worksheets, question banks, and previous year papers. All material is prepared by our expert faculty and is regularly updated to align with the latest syllabus and exam patterns. Digital access is also provided.",
  },
  {
    question: "What makes Bindra Knowledge Hub different?",
    answer: "Our difference lies in three pillars: 1) Personalized Attention — small batches ensure every student is heard, 2) Concept-Based Learning — we build deep understanding, not just rote memorization, 3) Family Values — founded on a 20+ year teaching legacy, we treat every student like family. Our results and parent testimonials reflect this commitment.",
  },
] as const;

export function FAQ() {
  return (
    <Section id="faq" aria-labelledby="faq-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <Badge variant="accent" className="mb-4 inline-flex">
            <MessageSquare aria-hidden="true" className="size-3.5" />
            FAQ
          </Badge>
          <Heading as="h2" id="faq-heading" size="display" align="center" className="max-w-3xl">
            Frequently Asked Questions
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            Quick answers to common questions. Can&apos;t find what you&apos;re looking for? Contact us directly.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger className="flex w-full items-center justify-between py-5 font-medium text-foreground hover:text-primary transition-colors">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-0">
                <p className="text-body text-muted-foreground leading-relaxed">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <Heading as="h3" size="display" align="center" className="max-w-2xl mx-auto mb-4">
            Still Have Questions?
          </Heading>
          <p className="mx-auto max-w-xl text-body-lg text-muted-foreground mb-8">
            Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
          </p>
          <Button asChild variant="outline" size="lg" className="min-w-[220px] px-8 min-h-[52px]">
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}