"use client";

import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}

const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Learning Lane, Sector 17, Chandigarh, Punjab 160017",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@bindraknowledgehub.com",
    href: "mailto:hello@bindraknowledgehub.com",
  },
];

const hours = [
  { day: "Monday \u2013 Friday", time: "9:00 AM \u2013 7:00 PM" },
  { day: "Saturday", time: "9:00 AM \u2013 5:00 PM" },
  { day: "Sunday", time: "Closed (Appointment only)" },
] as const;

const gridPattern = 'url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%239C9C9C%27%20fill-opacity%3D%270.03%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';

export function Contact() {
  return (
    <Section id="contact" aria-labelledby="contact-heading" className="py-section-y-sm lg:py-section-y">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-body-sm font-medium text-primary mb-6">
            <Mail aria-hidden="true" className="size-3.5" />
            Get in Touch
          </span>
          <Heading as="h2" id="contact-heading" size="display" align="center" className="max-w-3xl">
            Visit Bindra Knowledge Hub
          </Heading>
          <p className="mt-5 max-w-2xl mx-auto text-body-lg text-muted-foreground text-balance">
            We&apos;d love to hear from you. Whether you have questions about our programs, want to schedule a visit,
            or need academic guidance, our team is here to help.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <Heading as="h3" size="lg" className="mb-6">
              Contact Information
            </Heading>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <Card key={index} className="p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  <CardContent className="flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                      <item.icon aria-hidden="true" className="size-6" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-body text-foreground hover:text-primary transition-colors break-all"
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-body text-foreground">{item.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Opening Hours */}
            <Card className="p-6 mt-6">
              <CardContent>
                <Heading as="h4" size="md" className="mb-4">
                  Opening Hours
                </Heading>
                <dl className="space-y-3">
                  {hours.map((hour, i) => (
                    <div key={i} className="flex justify-between items-center text-body text-foreground">
                      <dt className="font-medium">{hour.day}</dt>
                      <dd className="text-muted-foreground">{hour.time}</dd>
                    </div>
                  ))}
              </dl>
            </CardContent>
            </Card>
          </div>

          {/* Map Placeholder + Form */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card className="h-[400px]">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50">
                  <div className="absolute inset-0" style={{ backgroundImage: gridPattern }} />

                  <div className="relative z-10 flex h-full items-center justify-center p-8">
                    <div className="text-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                        <MapPin aria-hidden="true" className="size-7" />
                      </div>
                      <Heading as="h4" size="lg" className="mb-3">
                        Our Location
                      </Heading>
                      <p className="text-body text-muted-foreground max-w-sm mx-auto">
                        123 Learning Lane, Sector 17, Chandigarh, Punjab 160017
                      </p>
                      <p className="mt-4 text-body-sm text-muted-foreground">
                        Placeholder — replace with Google Maps embed in production
                      </p>
                    </div>

                    <div className="absolute top-4 left-4 size-20 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
                    <div className="absolute bottom-4 right-4 size-20 rounded-full bg-accent/10 blur-2xl" aria-hidden="true" />
                  </div>

                  <p className="hidden lg:block mt-4 text-center text-body-xs text-muted-foreground">
                    Placeholder — replace with Google Maps embed in production
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Enquiry Form */}
            <Card className="p-6 lg:p-8">
            <CardContent className="p-0">
              <h3 className="font-heading text-xl font-semibold mb-2">Send Us a Message</h3>
              <p className="text-body text-muted-foreground mb-6">We&apos;ll get back to you within 24 hours.</p>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form submission will be implemented in an upcoming sprint."); }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-body-sm font-medium text-foreground mb-1.5">Full Name *</label>
                    <Input id="name" placeholder="Your name" required autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-body-sm font-medium text-foreground mb-1.5">Email *</label>
                    <Input id="email" type="email" placeholder="your@email.com" required autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-body-sm font-medium text-foreground mb-1.5">Phone *</label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" required autoComplete="tel" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-body-sm font-medium text-foreground mb-1.5">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full h-11 rounded-full border border-input bg-background px-4 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="admissions">Admissions Enquiry</option>
                    <option value="demo">Book a Demo Class</option>
                    <option value="assessment">Free Assessment</option>
                    <option value="careers">Career Opportunities</option>
                    <option value="general">General Enquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-body-sm font-medium text-foreground mb-1.5">Message *</label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[280px] px-10 min-h-[56px]">
                Send Message
              </Button>

              <p className="text-center text-body-sm text-muted-foreground">
                This is a placeholder form. Backend integration arrives in an upcoming sprint.
              </p>
            </form>
          </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  </Section>
  );
}