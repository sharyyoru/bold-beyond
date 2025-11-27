import { fetchSanity, queries } from "@/lib/sanity";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FAQ {
  _id: string;
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  category: string;
}

const categoryLabels: Record<string, string> = {
  general: "General",
  booking: "Booking",
  payment: "Payment",
  services: "Services",
  account: "Account",
  cancellation: "Cancellation",
};

export default async function FAQPage() {
  const faqs = await fetchSanity<FAQ[]>(queries.allFaqs);

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || "general";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(faqsByCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about our services, booking process,
            and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          {categories.length > 0 ? (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {categoryLabels[category] || category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <Accordion type="single" collapsible className="w-full">
                    {faqsByCategory[category].map((faq, index) => (
                      <AccordionItem key={faq._id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No FAQs available yet. Check back soon!
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 text-center p-8 bg-muted rounded-2xl">
            <h3 className="text-xl font-semibold mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-gold text-white px-6 py-3 font-medium hover:bg-brand-gold/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
