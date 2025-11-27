import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ChevronLeft,
  Navigation,
} from "lucide-react";

interface Clinic {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  logo?: any;
  images?: any[];
  description?: string;
  descriptionAr?: string;
  address?: string;
  addressAr?: string;
  area?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  amenities?: string[];
  services?: Array<{ _id: string; title: string; slug: { current: string } }>;
  experts?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    photo?: any;
    title?: string;
  }>;
}

export default async function ClinicDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const clinic = await fetchSanity<Clinic | null>(queries.clinicBySlug, {
    slug: params.slug,
  });

  if (!clinic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-brand-navy text-white py-8">
        <div className="container">
          <Button variant="ghost" size="sm" asChild className="mb-4 text-white/80 hover:text-white">
            <Link href="/clinics">
              <ChevronLeft className="mr-2 h-4 w-4" />
              All Clinics
            </Link>
          </Button>

          <div className="flex items-center gap-6">
            {clinic.logo && (
              <div className="h-20 w-20 bg-white rounded-xl flex items-center justify-center p-2">
                <img
                  src={urlFor(clinic.logo).width(80).url()}
                  alt={clinic.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-display font-bold">{clinic.name}</h1>
              {clinic.area && (
                <p className="text-white/80 flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {clinic.area}, {clinic.city || "Dubai"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            {clinic.images && clinic.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {clinic.images.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={urlFor(image).width(400).height(300).url()}
                      alt={`${clinic.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {clinic.description && (
              <div>
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground">{clinic.description}</p>
              </div>
            )}

            {/* Services */}
            {clinic.services && clinic.services.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Services Available</h2>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((service) => (
                    <Link
                      key={service._id}
                      href={`/services/${service.slug.current}`}
                      className="inline-block rounded-full bg-muted px-4 py-2 text-sm hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Experts */}
            {clinic.experts && clinic.experts.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Our Experts</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {clinic.experts.map((expert) => (
                    <Link key={expert._id} href={`/experts/${expert.slug.current}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-14 w-14">
                            {expert.photo && (
                              <AvatarImage
                                src={urlFor(expert.photo).width(100).url()}
                                alt={expert.name}
                              />
                            )}
                            <AvatarFallback>
                              {expert.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{expert.name}</p>
                            {expert.title && (
                              <p className="text-sm text-muted-foreground">
                                {expert.title}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {clinic.amenities && clinic.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {clinic.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-block rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Contact & Location</h3>

                {clinic.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{clinic.address}</span>
                  </div>
                )}

                {clinic.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${clinic.phone}`} className="hover:text-brand-gold">
                      {clinic.phone}
                    </a>
                  </div>
                )}

                {clinic.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${clinic.email}`} className="hover:text-brand-gold">
                      {clinic.email}
                    </a>
                  </div>
                )}

                {clinic.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-gold"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {clinic.coordinates && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {clinic.openingHours && clinic.openingHours.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Opening Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    {clinic.openingHours.map((hours, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                      >
                        <span className="text-muted-foreground">{hours.day}</span>
                        <span>
                          {hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Book CTA */}
            <Button variant="gold" size="lg" className="w-full" asChild>
              <Link href="/booking/select-service">Book an Appointment</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
