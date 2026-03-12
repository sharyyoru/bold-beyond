import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Heart, 
  Sparkles, 
  Users, 
  Clock, 
  Star,
  CheckCircle2,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";

type Service = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  icon?: string;
  category?: string;
  benefits?: string[];
  duration?: number;
  image?: { asset: { _ref: string } };
  rating?: number;
  reviewCount?: number;
  provider?: {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: { asset: { _ref: string } };
  };
};

interface ServicePageProps {
  params: { slug: string };
}

// Category page configuration
const categoryConfig: Record<string, {
  title: string;
  description: string;
  icon: any;
  video: string;
  color: string;
  bgGradient: string;
  backendCategory: string;
  benefits: string[];
}> = {
  psychotherapy: {
    title: "Psychotherapy",
    description: "Professional mental health support with licensed therapists. Our expert psychotherapists help you navigate life's challenges with evidence-based approaches.",
    icon: Brain,
    video: "/updated-assets/psychotherapy.mov",
    color: "#6B9BC3",
    bgGradient: "from-[#6B9BC3] to-[#5BB5B0]",
    backendCategory: "therapy",
    benefits: [
      "Licensed and accredited therapists",
      "Evidence-based treatment approaches",
      "Confidential and secure sessions",
      "Flexible online and in-person options",
      "Personalized treatment plans",
      "Ongoing support and progress tracking"
    ]
  },
  "life-coaching": {
    title: "Life Coaching",
    description: "Transform your goals into achievements with expert guidance. Our certified life coaches empower you to unlock your full potential.",
    icon: Sparkles,
    video: "/updated-assets/lifecoaching.mov",
    color: "#D4AF37",
    bgGradient: "from-[#D4AF37] to-[#E8A87C]",
    backendCategory: "coaching",
    benefits: [
      "Goal setting and achievement strategies",
      "Personal development coaching",
      "Career transition support",
      "Work-life balance optimization",
      "Accountability partnerships",
      "Actionable roadmaps for success"
    ]
  },
  "couples-therapy": {
    title: "Couples Therapy",
    description: "Strengthen your relationships with specialized counseling. Our relationship experts help couples build deeper connections and resolve conflicts.",
    icon: Heart,
    video: "/updated-assets/couplestherapy.mp4",
    color: "#E9967A",
    bgGradient: "from-[#E9967A] to-[#F4A261]",
    backendCategory: "therapy",
    benefits: [
      "Specialized relationship counselors",
      "Communication improvement techniques",
      "Conflict resolution strategies",
      "Intimacy and connection building",
      "Pre-marital counseling available",
      "Safe space for both partners"
    ]
  },
  "group-sessions": {
    title: "Group Sessions",
    description: "Connect and grow with supportive community workshops. Experience the power of shared healing and collective growth.",
    icon: Users,
    video: "/updated-assets/groupsessions.mp4",
    color: "#5BB5B0",
    bgGradient: "from-[#5BB5B0] to-[#6B9BC3]",
    backendCategory: "wellness",
    benefits: [
      "Supportive community environment",
      "Diverse workshop topics",
      "Expert-facilitated sessions",
      "Peer support and connection",
      "Affordable group rates",
      "Regular scheduled meetings"
    ]
  }
};

export const revalidate = 60;

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = params;
  
  // Check if this is a category page
  const config = categoryConfig[slug];
  
  if (config) {
    // Render category page
    const services = await fetchSanity<Service[]>(queries.servicesByCategory, { 
      category: config.backendCategory 
    }) || [];
    
    const IconComponent = config.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-palette-sand/20 to-white">
        {/* Hero Section with Video */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} py-16 md:py-24`}>
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Background Video */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            >
              <source src={config.video} type={config.video.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
            </video>
          </div>
          
          <div className="container relative z-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <IconComponent className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Wellbeing Services</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                  {config.title}
                </h1>
                
                <p className="text-lg text-white/90 mb-8 max-w-lg">
                  {config.description}
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-white/90 shadow-lg"
                  asChild
                >
                  <Link href="/download">
                    <Download className="h-5 w-5 mr-2" />
                    View in App
                  </Link>
                </Button>
              </div>
              
              {/* Benefits Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Why Choose Our {config.title}?</h3>
                <ul className="space-y-4">
                  {config.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-white/90 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-palette-sky mb-4">
                Available Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our curated selection of {config.title.toLowerCase()} services from verified professionals.
              </p>
            </div>

            {services.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card 
                    key={service._id}
                    className="group overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {service.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={urlFor(service.image).width(400).height(300).url()}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {service.duration && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                            <Clock className="h-3 w-3" />
                            {service.duration} min
                          </div>
                        )}
                      </div>
                    )}
                    
                    <CardContent className="p-5">
                      {service.provider && (
                        <div className="flex items-center gap-2 mb-3">
                          {service.provider.logo && (
                            <Image
                              src={urlFor(service.provider.logo).width(24).height(24).url()}
                              alt={service.provider.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          <span className="text-xs text-gray-500">{service.provider.name}</span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-palette-sea transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      
                      {service.rating && (
                        <div className="flex items-center gap-1 mb-4">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                          {service.reviewCount && (
                            <span className="text-xs text-gray-400">({service.reviewCount} reviews)</span>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-palette-sea hover:bg-palette-sea/90"
                        asChild
                      >
                        <Link href="/download">
                          <Download className="h-4 w-4 mr-2" />
                          View in App
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Sample services when no backend data */
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: `${config.title} Session`, desc: `Professional ${config.title.toLowerCase()} session with our certified experts.` },
                  { title: `Online ${config.title}`, desc: `Convenient virtual sessions from the comfort of your home.` },
                  { title: `Premium ${config.title}`, desc: `Extended sessions with our top-rated practitioners.` },
                ].map((sample, i) => (
                  <Card 
                    key={i}
                    className="group overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${config.color}40, ${config.color}20)` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="h-16 w-16" style={{ color: config.color }} />
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-palette-sea transition-colors">
                        {sample.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {sample.desc}
                      </p>
                      
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">4.9</span>
                        <span className="text-xs text-gray-400">(50+ reviews)</span>
                      </div>
                      
                      <Button 
                        className="w-full bg-palette-sea hover:bg-palette-sea/90"
                        asChild
                      >
                        <Link href="/download">
                          <Download className="h-4 w-4 mr-2" />
                          View in App
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your {config.title} Journey?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Download the Bold & Beyond app to explore all our {config.title.toLowerCase()} services, book sessions, and track your progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-palette-sand text-gray-900 hover:bg-palette-sand/90"
                  asChild
                >
                  <Link href="/download">
                    <Download className="h-5 w-5 mr-2" />
                    Download App
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/services">
                    Browse All Services
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Regular service detail page
  const service = await fetchSanity<Service | null>(queries.serviceBySlug, {
    slug: params.slug,
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
          <CardDescription>Bold & Beyond service overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {service.description && <p>{service.description}</p>}
          <Button className="bg-palette-sea hover:bg-palette-sea/90" asChild>
            <Link href="/download">
              <Download className="h-4 w-4 mr-2" />
              View in App
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
