export type Service = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  summary: string;
  services: string[];
  benefits: string[];
};

export const services: Service[] = [
  {
    slug: "building-services", icon: "🏗️", title: "Building Services",
    description: "From residential homes to large commercial and industrial structures — we manage every phase from foundation to finishing.",
    summary: "Reliable construction delivery for homes, commercial spaces and institutional projects across Malawi.",
    services: ["Site assessment and project planning", "Foundation, structural and masonry works", "Renovations, extensions and finishing", "Quality coordination from start to handover"],
    benefits: ["One accountable construction partner", "Clear programme and progress communication", "Quality materials and skilled workmanship"],
  },
  {
    slug: "construction-materials", icon: "🧱", title: "Construction Materials",
    description: "Machine-manufactured concrete blocks and interlocking pavers, produced on-site to cut transport costs and ensure quality.",
    summary: "Durable, professionally produced materials that give your project a stronger start and a refined finish.",
    services: ["Machine-manufactured concrete blocks", "Interlocking pavers in practical designs", "On-site materials production where suitable", "Supply planning for projects of every scale"],
    benefits: ["Consistent quality and durability", "Reduced transport costs where on-site production is possible", "Materials suited to Malawi's construction needs"],
  },
  {
    slug: "construction-consultancy", icon: "📐", title: "Construction Consultancy",
    description: "Expert design input, engineering solutions, and project management services that turn visions into lasting structures.",
    summary: "Practical advice and project oversight that help turn ambitious ideas into well-managed construction work.",
    services: ["Project scoping and cost guidance", "Construction planning and scheduling", "Technical input and coordination", "Progress monitoring and quality support"],
    benefits: ["Better-informed project decisions", "Practical control of time and resources", "A clearer route from concept to completion"],
  },
  {
    slug: "borehole-drilling", icon: "💧", title: "Borehole Drilling",
    description: "Professional borehole drilling and complete water installation services for residential, commercial and institutional clients.",
    summary: "Dependable water solutions designed around the needs of homes, businesses and institutions.",
    services: ["Borehole drilling and installation", "Water system planning", "Pump and water-access installation", "Project support from assessment to completion"],
    benefits: ["A dependable long-term water source", "Professional site-focused delivery", "Solutions tailored to your requirements"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
