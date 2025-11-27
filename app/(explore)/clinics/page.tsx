import Link from "next/link";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Star } from "lucide-react";

interface Clinic {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  logo?: any;
  description?: string;
  address?: string;
  area?: string;
  phone?: string;
  featured?: boolean;
}

export default async function ClinicsPage() {
  const clinics = await fetchSanity<Clinic[]>(queries.allClinics);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our Clinic Locations
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Visit us at our conveniently located clinics across the UAE for
            in-person sessions and consultations.
          </p>
        </div>
      </section>

      {/* Clinics Grid */}
      <section className="py-16">
        <div className="container">
          {clinics.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clinics.map((clinic) => (
                <Link
                  key={clinic._id}
                  href={`/clinics/${clinic.slug.current}`}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                    {clinic.logo && (
                      <div className="h-40 bg-muted flex items-center justify-center p-6">
                        <img
                          src={urlFor(clinic.logo).width(200).url()}
                          alt={clinic.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{clinic.name}</h3>
                        {clinic.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 px-2 py-0.5 text-xs font-medium text-brand-gold">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>

                      {clinic.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {clinic.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-muted-foreground">
                        {clinic.area && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{clinic.area}</span>
                          </div>
                        )}
                        {clinic.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{clinic.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No clinics available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
