import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";

const footerLinks = {
  services: [
    { name: "Psychotherapy", href: "/services/psychotherapy" },
    { name: "Life Coaching", href: "/services/life-coaching" },
    { name: "Wellbeing Programs", href: "/services/wellness-programs" },
    { name: "Corporate Wellbeing", href: "/services/corporate-wellness" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Experts", href: "/experts" },
    { name: "Partners", href: "/partners" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="border-t border-white/20 bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-palette-sand/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="container py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/new-assets/bnb-white.png"
                alt="Bold & Beyond"
                width={120}
                height={120}
                className="object-contain"
                style={{ width: 120, height: 120 }}
              />
            </Link>
            <p className="mt-4 text-sm text-white/70 max-w-xs font-bold">
              Your comprehensive wellness journey starts here. Connect with
              expert therapists, book sessions, and unlock exclusive partner
              perks.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/60 hover:text-palette-sand transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-palette-sand">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-palette-sand">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-palette-sand">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@boldandbeyond.ae"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                hello@boldandbeyond.ae
              </a>
              <a
                href="tel:+97142345678"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +971 4 234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {new Date().getFullYear()} Bold & Beyond. All rights
            reserved. Dubai, UAE.
          </p>
        </div>
      </div>
    </footer>
  );
}
