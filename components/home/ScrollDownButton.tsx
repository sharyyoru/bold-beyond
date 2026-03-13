"use client";

export default function ScrollDownButton() {
  const handleScroll = () => {
    const servicesSection = document.getElementById('services-section');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleScroll}
      className="group flex flex-col items-center gap-2 text-palette-sand hover:text-palette-sand/80 transition-colors"
    >
      <span className="text-xs font-medium uppercase tracking-wider">Scroll Down</span>
      <div className="w-6 h-10 rounded-full border-2 border-palette-sand flex justify-center pt-2 group-hover:border-palette-sand/80 transition-colors">
        <div className="w-1 h-2 bg-palette-sand rounded-full animate-bounce" />
      </div>
    </button>
  );
}
