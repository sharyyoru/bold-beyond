import { Star } from "lucide-react";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  _id: string;
  clientName: string;
  clientPhoto?: any;
  rating: number;
  content: string;
  service?: { title: string };
  expert?: { name: string };
}

export async function TestimonialsSection() {
  const testimonials = await fetchSanity<Testimonial[]>(queries.allTestimonials);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who have transformed their lives with Bold & Beyond
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => (
            <Card key={testimonial._id} className="h-full">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-brand-gold text-brand-gold"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    {testimonial.clientPhoto && (
                      <AvatarImage
                        src={urlFor(testimonial.clientPhoto).width(80).url()}
                        alt={testimonial.clientName}
                      />
                    )}
                    <AvatarFallback>
                      {testimonial.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.clientName}</p>
                    {testimonial.service && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.service.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
