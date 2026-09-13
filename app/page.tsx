"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicContent, supabaseConfigured, type NewsPost, type Vacancy } from "@/lib/supabase-api";

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setVal(Math.round(target * (frame / total)));
      if (frame >= total) clearInterval(timer);
    }, 2000 / total);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, direction = "up" }: {
  children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" | "none";
}) {
  const { ref, visible } = useReveal();
  const transforms: Record<string, string> = {
    up: "translateY(40px)", left: "translateX(-40px)",
    right: "translateX(40px)", none: "none",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function ProductImages({ files, alt }: { files: string[]; alt: string }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (files.length < 2) return;
    const timer = window.setInterval(() => setActiveImage((current) => (current + 1) % files.length), 4200);
    return () => window.clearInterval(timer);
  }, [files.length]);

  return <div className="product-images">
    {files.map((file, index) => <Image key={file} src={`/images/${file}`} alt={index === activeImage ? alt : ""} aria-hidden={index !== activeImage} fill sizes="(max-width: 760px) 100vw, 50vw" className={index === activeImage ? "product-image active" : "product-image"} />)}
  </div>;
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeNews, setActiveNews] = useState<"news" | "vacancies">("news");
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 50); setScrollY(window.scrollY); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured()) return;
    getPublicContent()
      .then(({ news, vacancies: publishedVacancies }) => {
        setNewsItems(news);
        setVacancies(publishedVacancies);
      })
      .catch(() => setContentError(true));
  }, []);

  const navLinks = [
    ["#home", "Home"], ["#services", "Services"], ["#products", "Products"],
    ["#milestones", "Milestones"], ["#news", "News"], ["#why", "Why Us"],
    ["#team", "Team"], ["#contact", "Contact"],
  ];

  const services = [
    { icon: "🏗️", title: "Building Services", desc: "From residential homes to large commercial and industrial structures — we manage every phase from foundation to finishing." },
    { icon: "🧱", title: "Construction Materials", desc: "Machine-manufactured concrete blocks and interlocking pavers, produced on-site to cut transport costs and ensure quality." },
    { icon: "📐", title: "Construction Consultancy", desc: "Expert design input, engineering solutions, and project management services that turn visions into lasting structures." },
    { icon: "💧", title: "Borehole Drilling", desc: "Professional borehole drilling and complete water installation services for residential, commercial and institutional clients." },
  ];

  const milestones = [
    { year: "2020", title: "Company Founded", desc: "Phaneroo Constructions Ltd was established in Lilongwe by Ranwell Fatsani Mwale with a vision to transform Malawi's construction sector.", icon: "🏛️" },
    { year: "2021", title: "First Major Contract", desc: "Secured a 10M+ kwacha contract with the Department of Forestry, cementing our reputation for quality government work.", icon: "📋" },
    { year: "2022", title: "Materials Division Launch", desc: "Expanded into manufacturing — launching our concrete blocks and interlocking pavers production line to become a one-stop construction shop.", icon: "🧱" },
    { year: "2023", title: "Church Partnership", desc: "Awarded a 12M+ kwacha concrete block supply contract with Mwala CCAP Church, Chilinde Lilongwe.", icon: "⛪" },
    { year: "2024", title: "Kabudula Pig Farm", desc: "Completed a multi-million kwacha livestock facility construction project at Kabudula in Lilongwe District.", icon: "🏗️" },
    { year: "2025", title: "City Council Mega Deal", desc: "Secured a landmark 162M+ kwacha contract with Lilongwe City Council to supply 90,000+ blocks for Chilinde Newlines Market.", icon: "🏆" },
  ];

  /* ── Team: update names, roles and image filenames when ready ── */
  const team = [
    { name: "Ranwell Fatsani", role: "Chief Executive Officer", img: "Ranwell Fatsani.jpeg", position: "center top" },
    { name: "Brian Zulanga", role: "Team Member", img: "Brian Zulanga.jpeg", position: "center 70%" },
    { name: "Enerst Mphande", role: "Team Member", img: "Enerst Mphande.jpeg", position: "center 70%" },
    { name: "Grace Kanjeza", role: "Team Member", img: "Grace Kanjeza.jpeg", position: "center top" },
    { name: "Tracina", role: "Team Member", img: "Tracina.jpg", position: "center top" },
    { name: "Uchizi Nkhoma", role: "Team Member", img: "Uchizi Nkhoma.jpeg", position: "center top" },
  ];

  const whyItems = [
    { t: "Affordable Excellence", d: "Competitive pricing without compromising on quality or durability." },
    { t: "Experienced Professionals", d: "A highly skilled team in both construction and materials production." },
    { t: "On-Time Delivery", d: "We excel in project time management — your schedule is our commitment." },
    { t: "On-Site Production", d: "We produce blocks at your site to eliminate transport costs and waste." },
    { t: "Client-First Culture", d: "A friendly, professional team that creates a conducive environment for all." },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --navy:#1A2B4A; --red:#C8001E; --concrete:#F5F0EB;
          --white:#FFFFFF; --charcoal:#2D2D2D; --gray:#6B7280; --light:#E5E7EB;
        }
        body { font-family:'Segoe UI',system-ui,sans-serif; color:var(--charcoal); background:var(--white); margin:0; }

        /* ── NAV ── */
        nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.25rem 2rem;
          transition:background 0.4s, padding 0.4s, box-shadow 0.4s;
        }
        nav.scrolled { background:var(--navy); padding:0.7rem 2rem; box-shadow:0 2px 24px rgba(0,0,0,0.35); }
        .nav-logo { display:flex; align-items:center; text-decoration:none; }
        .nav-links { display:flex; gap:1.5rem; list-style:none; margin:0; padding:0; }
        .nav-links a {
          color:rgba(255,255,255,0.85); text-decoration:none;
          font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em;
          transition:color 0.2s; position:relative; padding-bottom:3px;
        }
        .nav-links a::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:var(--red); transition:width 0.3s; }
        .nav-links a:hover { color:white; }
        .nav-links a:hover::after { width:100%; }
        .nav-cta { background:var(--red) !important; color:white !important; padding:0.45rem 1.1rem !important; border-radius:4px; }
        .nav-cta::after { display:none !important; }
        .nav-cta:hover { background:#a50019 !important; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
        .hamburger span { width:26px; height:2px; background:white; display:block; }
        .mobile-menu { display:none; position:fixed; inset:0; background:var(--navy); z-index:199; flex-direction:column; align-items:center; justify-content:center; gap:2rem; overflow-y:auto; }
        .mobile-menu.open { display:flex; animation:fadeIn 0.3s ease; }
        .mobile-menu a { color:white; text-decoration:none; font-size:1.4rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; }
        .mobile-close { position:absolute; top:1.5rem; right:2rem; background:none; border:none; color:white; font-size:2rem; cursor:pointer; }

        /* ── HERO ── */
        .hero { min-height:100vh; position:relative; overflow:hidden; display:flex; align-items:center; }
        .hero-bg { position:absolute; inset:0; z-index:0; }
        .hero-overlay { position:absolute; inset:0; z-index:1; background:linear-gradient(135deg, rgba(10,20,40,0.93) 40%, rgba(10,20,40,0.6) 100%); }
        .hero-slash { position:absolute; bottom:-2px; left:0; right:0; height:80px; z-index:3; background:white; clip-path:polygon(0 100%,100% 0,100% 100%); }
        .hero-content { position:relative; z-index:4; max-width:1200px; margin:0 auto; padding:9rem 2rem 7rem; width:100%; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:0.75rem; color:var(--red); font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.18em; margin-bottom:1.75rem; animation:slideRight 0.8s ease both; }
        .hero-eyebrow::before { content:''; width:36px; height:2px; background:var(--red); }
        h1 { font-size:clamp(2.8rem,7vw,5.8rem); font-weight:900; color:white; line-height:0.95; text-transform:uppercase; letter-spacing:-0.02em; margin-bottom:1.5rem; animation:slideUp 0.9s ease 0.2s both; }
        h1 em { color:var(--red); font-style:normal; display:block; }
        .hero-sub { color:rgba(255,255,255,0.65); font-size:1.05rem; max-width:500px; line-height:1.75; margin-bottom:2.5rem; animation:slideUp 0.9s ease 0.4s both; }
        .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; animation:slideUp 0.9s ease 0.6s both; }
        .hero-badge { position:absolute; right:2rem; bottom:6rem; z-index:4; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); border-radius:12px; padding:1.25rem 1.75rem; text-align:center; backdrop-filter:blur(12px); animation:fadeIn 1.2s ease 1s both; }
        .hero-badge strong { display:block; color:var(--red); font-size:2rem; font-weight:900; }
        .hero-badge span { color:rgba(255,255,255,0.5); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; }

        /* ── BUTTONS ── */
        .btn-primary { background:var(--red); color:white; padding:1rem 2rem; border-radius:4px; font-weight:700; font-size:0.88rem; text-transform:uppercase; letter-spacing:0.08em; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:transform 0.25s, box-shadow 0.25s, background 0.25s; }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(200,0,30,0.45); background:#a50019; }
        .btn-outline { border:2px solid rgba(255,255,255,0.4); color:white; padding:1rem 2rem; border-radius:4px; font-weight:700; font-size:0.88rem; text-transform:uppercase; letter-spacing:0.08em; text-decoration:none; display:inline-block; transition:border-color 0.25s, background 0.25s, transform 0.25s; }
        .btn-outline:hover { border-color:white; background:rgba(255,255,255,0.1); transform:translateY(-3px); }

        /* ── STATS ── */
        .stats { background:white; border-bottom:1px solid var(--light); padding:4rem 2rem; }
        .stats-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; text-align:center; }
        .stat-item { padding:1.5rem; position:relative; }
        .stat-item:not(:last-child)::after { content:''; position:absolute; right:0; top:20%; height:60%; width:1px; background:var(--light); }
        .stat-num { font-size:clamp(2rem,4vw,3.5rem); font-weight:900; color:var(--navy); line-height:1; }
        .stat-num em { color:var(--red); font-style:normal; }
        .stat-label { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:var(--gray); margin-top:0.5rem; }

        /* ── COMMON ── */
        section { padding:6rem 2rem; }
        .section-inner { max-width:1200px; margin:0 auto; }
        .section-tag { display:inline-flex; align-items:center; gap:0.6rem; color:var(--red); font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.18em; margin-bottom:0.75rem; }
        .section-tag::before { content:''; width:28px; height:2px; background:var(--red); }
        h2 { font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:900; color:var(--navy); text-transform:uppercase; line-height:1.05; letter-spacing:-0.01em; }
        .section-sub { color:var(--gray); margin-top:0.75rem; max-width:580px; line-height:1.75; }

        /* ── ABOUT ── */
        .about { background:var(--concrete); }
        .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
        .about-text p { color:var(--gray); line-height:1.85; margin-bottom:1rem; margin-top:1.25rem; }
        .values-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:2rem; }
        .value-chip { background:var(--navy); color:white; padding:0.6rem 1rem; border-radius:4px; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; text-align:center; border-left:3px solid var(--red); transition:transform 0.2s, box-shadow 0.2s; }
        .value-chip:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(26,43,74,0.2); }
        .about-img-wrap { position:relative; padding-bottom:2rem; padding-right:1rem; }
        .about-img-frame { border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(26,43,74,0.2); position:relative; z-index:1; }
        .about-img-frame img { width:100%; height:auto; display:block; transition:transform 0.6s ease; }
        .about-img-frame:hover img { transform:scale(1.03); }
        .about-accent { position:absolute; bottom:0; right:0; width:120px; height:120px; background:var(--red); border-radius:8px; opacity:0.4; z-index:0; }
        .about-card { position:absolute; bottom:8px; left:-20px; z-index:2; background:var(--navy); border-radius:10px; padding:1.2rem 1.5rem; color:white; box-shadow:0 12px 32px rgba(0,0,0,0.25); min-width:200px; }
        .about-card h3 { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--red); margin-bottom:0.35rem; }
        .about-card p { font-size:1rem; font-weight:800; line-height:1.3; }

        /* ── SERVICES ── */
        .services { background:white; }
        .services-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; margin-top:3rem; }
        .service-card { border:2px solid var(--light); border-radius:10px; padding:2.25rem; transition:all 0.35s; cursor:default; position:relative; overflow:hidden; background:white; }
        .service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--red); transform:scaleX(0); transform-origin:left; transition:transform 0.35s; }
        .service-card:hover { border-color:transparent; box-shadow:0 12px 40px rgba(26,43,74,0.12); transform:translateY(-4px); }
        .service-card:hover::before { transform:scaleX(1); }
        .service-icon { font-size:2.8rem; margin-bottom:1.25rem; display:block; }
        .service-card h3 { font-size:1rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--navy); margin-bottom:0.75rem; }
        .service-card p { color:var(--gray); line-height:1.75; font-size:0.9rem; }

        /* ── PRODUCTS ── */
        .products { background:var(--navy); }
        .products .section-tag { color:var(--red); }
        .products-intro { color:rgba(255,255,255,0.5); margin-top:0.5rem; margin-bottom:3rem; }
        .products-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
        .product-card { position:relative; border-radius:10px; overflow:hidden; height:360px; cursor:default; }
        .product-images { position:absolute; inset:0; overflow:hidden; }
        .product-image { object-fit:cover; opacity:0; transform:scale(1); transition:opacity 0.8s ease, transform 0.6s ease; }
        .product-image.active { opacity:1; }
        .product-card:hover .product-image.active { transform:scale(1.05); }
        .product-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(10,20,40,0.95) 0%, rgba(10,20,40,0.4) 55%, rgba(10,20,40,0.05) 100%); display:flex; flex-direction:column; justify-content:flex-end; padding:2rem; transition:background 0.4s ease; }
        .product-card:hover .product-overlay { background:linear-gradient(to top, rgba(10,20,40,0.94) 0%, rgba(10,20,40,0.42) 52%, transparent 80%); }
        .product-overlay h3 { color:white; font-size:1.2rem; font-weight:900; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.5rem; transform:translateY(8px); transition:transform 0.4s ease; }
        .product-card:hover .product-overlay h3 { transform:translateY(0); }
        .product-overlay p { color:rgba(255,255,255,0.8); font-size:0.85rem; line-height:1.6; max-width:340px; opacity:0; transform:translateY(10px); transition:opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s; }
        .product-card:hover .product-overlay p { opacity:1; transform:translateY(0); }

        /* ── MILESTONES ── */
        .milestones { background:var(--concrete); }
        .timeline { position:relative; margin-top:3.5rem; }
        .timeline::before { content:''; position:absolute; left:50%; top:0; bottom:0; width:2px; background:linear-gradient(to bottom, var(--red), var(--navy)); transform:translateX(-50%); }
        .timeline-item { display:grid; grid-template-columns:1fr 60px 1fr; gap:0; margin-bottom:3rem; align-items:start; }
        .timeline-item.timeline-left .timeline-content { grid-column:1; text-align:right; padding-right:2.5rem; }
        .timeline-item.timeline-left .timeline-spacer { grid-column:3; }
        .timeline-item.timeline-right .timeline-content { grid-column:3; text-align:left; padding-left:2.5rem; }
        .timeline-item.timeline-right .timeline-spacer { grid-column:1; }
        .timeline-dot { grid-column:2; display:flex; flex-direction:column; align-items:center; gap:0.5rem; position:relative; z-index:2; }
        .timeline-dot-inner { width:48px; height:48px; border-radius:50%; background:var(--navy); border:3px solid var(--red); display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 4px 16px rgba(200,0,30,0.3); transition:transform 0.3s, box-shadow 0.3s; flex-shrink:0; }
        .timeline-item:hover .timeline-dot-inner { transform:scale(1.15); box-shadow:0 6px 24px rgba(200,0,30,0.5); }
        .timeline-year { font-size:0.7rem; font-weight:800; color:var(--red); text-transform:uppercase; letter-spacing:0.1em; }
        .timeline-content { background:white; border-radius:10px; padding:1.5rem 1.75rem; box-shadow:0 4px 20px rgba(26,43,74,0.08); transition:transform 0.3s, box-shadow 0.3s; }
        .timeline-item:hover .timeline-content { transform:translateY(-3px); box-shadow:0 10px 32px rgba(26,43,74,0.14); }
        .timeline-content h3 { font-size:0.95rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--navy); margin-bottom:0.5rem; }
        .timeline-content p { color:var(--gray); font-size:0.87rem; line-height:1.7; margin:0; }

        /* ── FIXED IMAGE BREAK ── */
        .fixed-image-break { min-height:360px; position:relative; display:grid; place-items:center; text-align:center; padding:4rem 1.5rem; background-image:linear-gradient(rgba(10,22,43,0.76), rgba(10,22,43,0.76)), url('/images/blocks.jpg'); background-size:cover; background-position:center; background-attachment:fixed; }
        .fixed-image-break-content { max-width:680px; color:white; }
        .fixed-image-break .section-tag { color:#fff; }
        .fixed-image-break .section-tag::before { background:var(--red); }
        .fixed-image-break h2 { color:white; margin:0.75rem 0 1rem; }
        .fixed-image-break p { color:rgba(255,255,255,0.82); font-size:1.05rem; line-height:1.75; margin:0; }

        /* ── NEWS / VACANCIES ── */
        .news { background:white; }
        .news-tabs { display:flex; gap:0; margin-top:2rem; margin-bottom:3rem; border:2px solid var(--light); border-radius:8px; overflow:hidden; width:fit-content; }
        .news-tab { padding:0.75rem 2rem; font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; cursor:pointer; border:none; background:transparent; color:var(--gray); transition:all 0.25s; }
        .news-tab.active { background:var(--navy); color:white; }
        .news-tab:hover:not(.active) { background:var(--light); color:var(--navy); }
        .news-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .news-card { border:2px solid var(--light); border-radius:10px; overflow:hidden; transition:all 0.3s; }
        .news-card:hover { border-color:var(--navy); transform:translateY(-4px); box-shadow:0 12px 36px rgba(26,43,74,0.1); }
        .news-img { height:180px; background:linear-gradient(135deg, var(--navy), #2d3f5f); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .news-img.has-image { background-size:cover; background-position:center; }
        .news-img.has-image .news-img-placeholder { display:none; }
        .news-img-placeholder { display:flex; flex-direction:column; align-items:center; gap:0.5rem; }
        .news-img-placeholder span { font-size:2.5rem; opacity:0.4; }
        .news-img-placeholder p { color:rgba(255,255,255,0.35); font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin:0; }
        .news-body { padding:1.5rem; }
        .news-meta { display:flex; gap:0.75rem; align-items:center; margin-bottom:0.75rem; }
        .news-tag { background:var(--red); color:white; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; padding:0.2rem 0.6rem; border-radius:3px; }
        .news-date { color:var(--gray); font-size:0.75rem; }
        .news-link { display:inline-block; color:var(--red); font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; text-decoration:none; margin-top:1rem; }
        .news-link:hover { color:var(--navy); }
        .news-card h3 { font-size:0.95rem; font-weight:800; color:var(--navy); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.6rem; }
        .news-card p { color:var(--gray); font-size:0.85rem; line-height:1.7; }
        .vacancies-list { display:flex; flex-direction:column; gap:1.25rem; }
        .vacancy-card { border:2px solid var(--light); border-radius:10px; padding:1.75rem 2rem; display:grid; grid-template-columns:1fr auto; gap:1.5rem; align-items:center; transition:all 0.3s; }
        .vacancy-card:hover { border-color:var(--red); box-shadow:0 8px 28px rgba(26,43,74,0.1); transform:translateX(4px); }
        .vacancy-card h3 { font-size:1rem; font-weight:800; color:var(--navy); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.4rem; }
        .vacancy-card p { color:var(--gray); font-size:0.87rem; line-height:1.65; margin:0; }
        .vacancy-meta { display:flex; gap:0.5rem; margin-top:0.6rem; flex-wrap:wrap; }
        .vacancy-pill { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; padding:0.25rem 0.7rem; border-radius:20px; }
        .vacancy-pill.type { background:rgba(26,43,74,0.08); color:var(--navy); }
        .vacancy-pill.location { background:rgba(200,0,30,0.08); color:var(--red); }
        .vacancy-btn { background:var(--navy); color:white; border:none; padding:0.75rem 1.5rem; border-radius:6px; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; cursor:pointer; white-space:nowrap; transition:background 0.2s, transform 0.2s; flex-shrink:0; }
        .vacancy-btn:hover { background:var(--red); transform:scale(1.03); }
        .vacancy-actions { display:flex; flex-direction:column; gap:0.6rem; align-items:stretch; }
        .coming-soon-note { text-align:center; padding:1rem; color:var(--gray); font-size:0.82rem; margin-top:1.5rem; font-style:italic; }

        /* ── WHY ── */
        .why { background:var(--concrete); }
        .why-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
        .why-list { list-style:none; display:flex; flex-direction:column; gap:1rem; padding:0; }
        .why-item { display:flex; gap:1rem; align-items:flex-start; background:white; border-radius:8px; padding:1.25rem 1.5rem; border-left:4px solid var(--red); transition:transform 0.25s, box-shadow 0.25s; }
        .why-item:hover { transform:translateX(6px); box-shadow:0 6px 20px rgba(26,43,74,0.1); }
        .why-check { color:var(--red); font-size:1.1rem; flex-shrink:0; margin-top:0.1rem; font-weight:900; }
        .why-item strong { color:var(--navy); display:block; font-size:0.87rem; margin-bottom:0.2rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; }
        .why-item p { color:var(--gray); font-size:0.87rem; line-height:1.6; margin:0; }
        .why-visual { background:var(--navy); border-radius:14px; padding:3rem; position:relative; overflow:hidden; }
        .why-visual::before { content:'"'; position:absolute; top:-1rem; left:1.5rem; font-size:9rem; color:var(--red); opacity:0.12; font-family:Georgia,serif; line-height:1; }
        .why-visual blockquote { position:relative; color:white; font-size:1.3rem; font-weight:700; line-height:1.5; margin-bottom:1.5rem; font-style:italic; }
        .why-visual cite { color:rgba(255,255,255,0.4); font-size:0.78rem; font-style:normal; text-transform:uppercase; letter-spacing:0.1em; font-weight:700; }
        .tagline-badge { margin-top:1.75rem; background:var(--red); display:inline-block; padding:0.6rem 1.5rem; color:white; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; border-radius:4px; }
        .why-logo-wrap { margin-top:2rem; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.1); }

        /* ── TEAM ── */
        .team { background:var(--navy); }
        .team .section-tag { color:var(--red); }
        .team h2 { color:white; }
        .team-sub { color:rgba(255,255,255,0.5); margin-top:0.75rem; margin-bottom:3rem; }
        .team-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.75rem; }
        .team-card { position:relative; border-radius:12px; overflow:hidden; aspect-ratio:3/4; cursor:default; }
        .team-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s ease; filter:grayscale(20%); }
        .team-card:hover img { transform:scale(1.06); filter:grayscale(0%); }
        .team-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(10,20,40,0.97) 0%, rgba(10,20,40,0.5) 45%, transparent 75%); display:flex; flex-direction:column; justify-content:flex-end; padding:1.75rem; transition:background 0.4s; }
        .team-card:hover .team-overlay { background:linear-gradient(to top, rgba(10,20,40,0.94) 0%, rgba(10,20,40,0.42) 52%, transparent 80%); }
        .team-role { font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--red); margin-bottom:0.35rem; transition:color 0.3s; }
        .team-card:hover .team-role { color:rgba(255,255,255,0.7); }
        .team-name { font-size:1.05rem; font-weight:800; color:white; line-height:1.2; }
        /* Placeholder state when no real photo yet */
        .team-photo-placeholder { width:100%; height:100%; background:linear-gradient(135deg, #1a2b4a 0%, #243650 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.75rem; }
        .team-avatar-ring { width:80px; height:80px; border-radius:50%; border:3px solid rgba(200,0,30,0.5); display:flex; align-items:center; justify-content:center; font-size:2rem; color:rgba(255,255,255,0.25); }

        /* ── CONTACT ── */
        .contact { background:var(--concrete); }
        .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
        .contact h2 { margin-bottom:1rem; }
        .contact-text { color:var(--gray); line-height:1.75; margin-bottom:2rem; }
        .contact-detail { display:flex; gap:1rem; margin-bottom:1.5rem; align-items:flex-start; }
        .contact-icon { width:46px; height:46px; border-radius:8px; background:var(--navy); color:white; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; transition:background 0.2s, transform 0.2s; }
        .contact-detail:hover .contact-icon { background:var(--red); transform:scale(1.08); }
        .contact-detail h4 { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:var(--gray); margin-bottom:0.25rem; }
        .contact-detail p { font-size:0.92rem; font-weight:600; color:var(--navy); }
        .contact-form { background:white; border-radius:12px; padding:2.5rem; box-shadow:0 8px 32px rgba(26,43,74,0.1); }
        .contact-form h3 { font-size:1.05rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--navy); margin-bottom:1.5rem; }
        .form-group { margin-bottom:1.25rem; }
        .form-group label { display:block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--gray); margin-bottom:0.5rem; }
        .form-group input, .form-group textarea, .form-group select { width:100%; padding:0.875rem 1rem; border:2px solid var(--light); border-radius:6px; font-size:0.95rem; background:white; transition:border-color 0.2s, box-shadow 0.2s; outline:none; font-family:inherit; color:var(--charcoal); }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color:var(--navy); box-shadow:0 0 0 3px rgba(26,43,74,0.08); }
        .form-group textarea { height:110px; resize:none; }
        .form-submit { width:100%; background:var(--red); color:white; border:none; padding:1rem; border-radius:6px; font-size:0.88rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; cursor:pointer; transition:background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .form-submit:hover { background:#a50019; transform:translateY(-2px); box-shadow:0 8px 20px rgba(200,0,30,0.35); }
        .fb-link { display:inline-flex; align-items:center; gap:0.4rem; color:rgba(26,43,74,0.65); text-decoration:none; font-size:0.85rem; margin-top:1rem; transition:color 0.2s; font-weight:600; }
        .fb-link:hover { color:var(--red); }

        /* ── FOOTER ── */
        footer { background:var(--charcoal); color:rgba(255,255,255,0.55); padding:3.5rem 2rem; }
        .footer-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr; gap:3rem; padding-bottom:2rem; border-bottom:1px solid rgba(255,255,255,0.08); }
        .footer-brand p { font-size:0.87rem; line-height:1.75; max-width:300px; margin-top:1rem; }
        footer h4 { color:white; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:1rem; }
        footer ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.6rem; }
        footer ul li a { color:rgba(255,255,255,0.45); text-decoration:none; font-size:0.87rem; transition:color 0.2s; }
        footer ul li a:hover { color:var(--red); }
        .footer-bottom { max-width:1200px; margin:1.5rem auto 0; display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; }
        .footer-bottom span { color:var(--red); font-weight:700; }
        .reg-info { opacity:0.4; font-size:0.72rem; }

        /* ── KEYFRAMES ── */
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        /* ── MOBILE ── */
        @media (max-width:900px) {
          .nav-links { display:none; }
          .hamburger { display:flex; }
          .hero-badge { display:none; }
          .about-grid, .services-grid, .products-grid, .why-grid, .contact-grid { grid-template-columns:1fr; gap:2.5rem; }
          .about-img-wrap { padding-bottom:1rem; padding-right:0; }
          .about-card { position:static; margin-top:1rem; }
          .about-accent { display:none; }
          .stats-inner { grid-template-columns:repeat(2,1fr); }
          .stat-item:nth-child(2)::after { display:none; }
          .team-grid { grid-template-columns:repeat(2,1fr); }
          .news-grid { grid-template-columns:1fr; }
          .timeline::before { left:20px; }
          .timeline-item { grid-template-columns:40px 1fr; }
          .timeline-item.timeline-left .timeline-content,
          .timeline-item.timeline-right .timeline-content { grid-column:2; text-align:left; padding-left:1.5rem; padding-right:0; }
          .timeline-item.timeline-left .timeline-spacer,
          .timeline-item.timeline-right .timeline-spacer { display:none; }
          .timeline-dot { grid-column:1; }
          .timeline-dot-inner { width:40px; height:40px; font-size:1rem; }
          .fixed-image-break { min-height:280px; background-attachment:scroll; }
          .vacancy-card { grid-template-columns:1fr; }
          .footer-inner { grid-template-columns:1fr; gap:2rem; }
          .footer-bottom { flex-direction:column; gap:0.5rem; text-align:center; }
          section { padding:4rem 1.5rem; }
          h1 { font-size:2.4rem; }
          .hero-content { padding:7rem 1.5rem 5rem; }
          .product-card { height:280px; }
        }
        @media (max-width:600px) {
          .stats-inner { grid-template-columns:1fr; }
          .stat-item::after { display:none; }
          .team-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ══ NAV ══ */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#home" className="nav-logo">
          <Image src="/logo-red-white.png" alt="Phaneroo Constructions Ltd" width={58} height={59} priority />
        </a>
        <ul className="nav-links">
          {navLinks.map(([h,l]) => (
            <li key={h}><a href={h} className={h === "#contact" ? "nav-cta" : ""}>{l}</a></li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ══ MOBILE MENU ══ */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {navLinks.map(([h,l]) => (
          <a key={h} href={h} onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
      </div>

      {/* ══ HERO ══ */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <Image src="/images/hero.jpeg" alt="Phaneroo Constructions" fill priority
            style={{ objectFit:"cover", objectPosition:"center" }} />
        </div>
        <div className="hero-overlay" />
        <div style={{ position:"absolute", top:0, right:"8%", width:3, bottom:0, zIndex:3, background:"var(--red)", opacity:0.5, transform:`translateY(${scrollY*0.12}px)`, transition:"transform 0.05s linear" }} />
        <div style={{ position:"absolute", top:0, right:"13%", width:1, bottom:0, zIndex:3, background:"rgba(255,255,255,0.07)", transform:`translateY(${scrollY*0.07}px)`, transition:"transform 0.05s linear" }} />
        <div className="hero-content">
          <div className="hero-eyebrow">Est. 2020 — Lilongwe, Malawi</div>
          <h1>Make Your<br /><em>Vision</em>Possible.</h1>
          <p className="hero-sub">
            Phaneroo Constructions Ltd is Malawi&apos;s trusted partner for building services,
            premium concrete materials, borehole drilling, and expert construction consultancy.
          </p>
          <div className="hero-btns">
            <a href="#contact" className="btn-primary">Get a Free Quote →</a>
            <a href="#services" className="btn-outline">Our Services</a>
          </div>
        </div>
        <div className="hero-badge">
          <strong>MK 162M+</strong>
          <span>Largest Contract</span>
        </div>
        <div className="hero-slash" />
      </section>

      {/* ══ STATS ══ */}
      <div className="stats">
        <div className="stats-inner">
          {[
            { target:50, suffix:"+", label:"Projects Completed" },
            { target:162, suffix:"M+", label:"MK Largest Contract" },
            { target:90000, suffix:"+", label:"Blocks Supplied" },
            { target:5, suffix:"+ yrs", label:"Industry Experience" },
          ].map((s) => (
            <Reveal key={s.label} direction="up">
              <div className="stat-item">
                <div className="stat-num"><Counter target={s.target} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <section className="about" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <Reveal direction="left">
              <div className="about-text">
                <div className="section-tag">About Us</div>
                <h2>Building More Than Structures</h2>
                <p>Founded in 2020 by visionary leader Ranwell Fatsani Mwale, Phaneroo Constructions Ltd began as a general contractor tackling challenging projects across Malawi. Today, we&apos;ve grown into a comprehensive construction solutions provider.</p>
                <p>We are strategically positioned to capitalize on Malawi&apos;s booming construction sector — offering everything from machine-manufactured building materials to full project management and engineering consultation.</p>
                <div className="values-grid">
                  {["Honesty","Integrity","Fairness","Professionalism"].map(v => (
                    <div className="value-chip" key={v}>{v}</div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={100}>
              <div className="about-img-wrap">
                <div className="about-img-frame">
                  <Image src="/images/about.webp" alt="About Phaneroo Constructions" width={600} height={420} style={{ width:"100%", height:"auto", display:"block" }} />
                </div>
                <div className="about-accent" />
                <div className="about-card">
                  <h3>CEO &amp; Founder</h3>
                  <p>Ranwell Fatsani Mwale<br /><span style={{fontWeight:400,fontSize:"0.82rem",opacity:0.65}}>5+ years experience</span></p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="services" id="services">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">What We Offer</div>
            <h2>Our Services</h2>
            <p className="section-sub">From foundations to finishing touches — your one-stop construction partner in Malawi.</p>
          </Reveal>
          <div className="services-grid">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} direction="up">
                <div className="service-card">
                  <span className="service-icon">{s.icon}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ══ */}
      <section className="products" id="products">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Our Products</div>
            <h2 style={{color:"white"}}>Premium Building Materials</h2>
            <p className="products-intro">Machinery-manufactured, highly rigid, vibration-resistant and highly durable. Hover to explore.</p>
          </Reveal>
          <div className="products-grid">
            {[
              { files:["blocks.jpg", "Concrete Blocks.jpeg"], title:"Concrete Blocks", desc:"Machine-manufactured, highly rigid and vibration-resistant. Available in multiple sizes for all construction needs." },
              { files:["Interlocking Pavers 1.jpg", "Interlocking Pavers 2.jpg"], title:"Interlocking Pavers", desc:"Diverse designs for driveways, walkways and outdoor spaces. Durable, beautiful and environmentally friendly." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 150} direction="up">
                <div className="product-card">
                  <ProductImages files={p.files} alt={p.title} />
                  <div className="product-overlay">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MILESTONES ══ */}
      <section className="milestones" id="milestones">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Our Journey</div>
            <h2>Milestones</h2>
            <p className="section-sub">From a bold idea in 2020 to a multi-million kwacha construction powerhouse — here is our story.</p>
          </Reveal>
          <div className="timeline">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
                <div className={`timeline-item ${i % 2 === 0 ? "timeline-left" : "timeline-right"}`}>
                  {i % 2 === 0 ? (
                    <>
                      <div className="timeline-content">
                        <h3>{m.title}</h3>
                        <p>{m.desc}</p>
                      </div>
                      <div className="timeline-dot">
                        <div className="timeline-dot-inner">{m.icon}</div>
                        <div className="timeline-year">{m.year}</div>
                      </div>
                      <div className="timeline-spacer" />
                    </>
                  ) : (
                    <>
                      <div className="timeline-spacer" />
                      <div className="timeline-dot">
                        <div className="timeline-dot-inner">{m.icon}</div>
                        <div className="timeline-year">{m.year}</div>
                      </div>
                      <div className="timeline-content">
                        <h3>{m.title}</h3>
                        <p>{m.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="fixed-image-break" aria-label="Phaneroo construction materials">
        <Reveal direction="up">
          <div className="fixed-image-break-content">
            <div className="section-tag">Built to Last</div>
            <h2>Strong Foundations. Lasting Results.</h2>
            <p>Quality materials and skilled workmanship for every project, from Lilongwe to communities across Malawi.</p>
          </div>
        </Reveal>
      </section>

      {/* ══ NEWS / UPDATES / VACANCIES ══ */}
      <section className="news" id="news">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Stay Updated</div>
            <h2>News &amp; Vacancies</h2>
            <p className="section-sub">Latest updates from Phaneroo Constructions, and open positions to join our growing team.</p>
          </Reveal>
          <div className="news-tabs">
            <button className={`news-tab ${activeNews === "news" ? "active" : ""}`} onClick={() => setActiveNews("news")}>📰 News &amp; Updates</button>
            <button className={`news-tab ${activeNews === "vacancies" ? "active" : ""}`} onClick={() => setActiveNews("vacancies")}>💼 Vacancies</button>
          </div>

          {activeNews === "news" && (
            <Reveal direction="up">
              <div className="news-grid">
                {newsItems.map((n) => (
                  <div className="news-card" key={n.id}>
                    <div className={`news-img ${n.image_url ? "has-image" : ""}`} style={n.image_url ? { backgroundImage:`url("${n.image_url}")` } : undefined}>
                      <div className="news-img-placeholder">
                        <span>📰</span>
                        <p>Image coming soon</p>
                      </div>
                    </div>
                    <div className="news-body">
                      <div className="news-meta">
                        <span className="news-tag">{n.category}</span>
                        <span className="news-date">{new Date(n.published_at).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                      </div>
                      <h3>{n.title}</h3>
                      <p>{n.excerpt}</p>
                      <Link className="news-link" href={`/news/${n.id}`}>Read more →</Link>
                    </div>
                  </div>
                ))}
              </div>
              {!newsItems.length && <p className="coming-soon-note">{contentError ? "News is temporarily unavailable. Please check back shortly." : "No news has been published yet. Check back soon!"}</p>}
            </Reveal>
          )}

          {activeNews === "vacancies" && (
            <Reveal direction="up">
              <div className="vacancies-list">
                {vacancies.map((v) => (
                  <div className="vacancy-card" key={v.id}>
                    <div>
                      <h3>{v.title}</h3>
                      <div className="vacancy-meta">
                        <span className="vacancy-pill type">{v.employment_type}</span>
                        <span className="vacancy-pill location">📍 {v.location}</span>
                      </div>
                      <p style={{marginTop:"0.6rem"}}>{v.description}</p>
                    </div>
                    <div className="vacancy-actions">
                      <Link className="vacancy-btn" href={`/vacancies/${v.id}`}>View details</Link>
                      {v.application_email ? <a className="vacancy-btn" href={`mailto:${v.application_email}?subject=${encodeURIComponent(`Application: ${v.title}`)}`}>Apply Now</a> : null}
                    </div>
                  </div>
                ))}
              </div>
              {!vacancies.length && <p className="coming-soon-note">{contentError ? "Vacancies are temporarily unavailable. Please check back shortly." : "There are no open vacancies right now. Please check back soon."}</p>}
            </Reveal>
          )}
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section className="why" id="why">
        <div className="section-inner">
          <div className="why-grid">
            <Reveal direction="left">
              <div>
                <div className="section-tag">Why Choose Us</div>
                <h2 style={{marginBottom:"2rem"}}>The Phaneroo Difference</h2>
                <ul className="why-list">
                  {whyItems.map((item) => (
                    <li className="why-item" key={item.t}>
                      <span className="why-check">✓</span>
                      <div><strong>{item.t}</strong><p>{item.d}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <div className="why-visual">
                <blockquote>&ldquo;Rumors have it that we are second to none!&rdquo;</blockquote>
                <cite>— Phaneroo Constructions Ltd</cite>
                <div className="tagline-badge">Build with us. Buy from us.</div>
                <div className="why-logo-wrap">
                  <Image src="/logo-red-white.png" alt="Phaneroo Constructions" width={92} height={94} style={{ opacity:0.7 }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="team" id="team">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Our People</div>
            <h2>Meet the Team</h2>
            <p className="team-sub">
              The great minds behind every structure we build — dedicated professionals committed to making your vision possible.
            </p>
          </Reveal>
          <div className="team-grid">
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 80} direction="up">
                <div className="team-card">
                  {/* Photos: drop team1.jpg … team6.jpg into public/images/ */}
                  <Image
                    src={`/images/${member.img}`}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit:"cover", objectPosition:member.position }}
                  />
                  <div className="team-overlay">
                    <div className="team-role">{member.role}</div>
                    <div className="team-name">{member.name}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section className="contact" id="contact">
        <div className="section-inner">
          <div className="contact-grid">
            <Reveal direction="left">
              <div>
                <div className="section-tag">Get In Touch</div>
                <h2>Let&apos;s Build Something Great</h2>
                <p className="contact-text" style={{marginTop:"1rem"}}>
                  Ready to start your project? Whether it&apos;s a home, commercial facility, or you need quality building materials — we&apos;d love to hear from you.
                </p>
                {[
                  { icon:"📍", label:"Our Location", val:"Mwala CCAP Church Premises, Opposite Kamuzu Barracks Small Gate, Chilinde Newlines, Lilongwe" },
                  { icon:"📞", label:"Call Us", val:"+265 997 112 169 / +265 888 977 069" },
                  { icon:"✉️", label:"Email Us", val:"phaneroocostructionltd@gmail.com" },
                  { icon:"🏛️", label:"Registration", val:"COY-ZZFAK8 | T-TIN: 70609494" },
                ].map(d => (
                  <div className="contact-detail" key={d.label}>
                    <div className="contact-icon">{d.icon}</div>
                    <div><h4>{d.label}</h4><p>{d.val}</p></div>
                  </div>
                ))}
                <a href="https://www.facebook.com/phaneroo-construction-Ltd" target="_blank" rel="noreferrer" className="fb-link">
                  📘 Follow us on Facebook
                </a>
              </div>
            </Reveal>
            <Reveal direction="right" delay={150}>
              <div className="contact-form">
                <h3>Send Us a Message</h3>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+265 xxx xxx xxx" />
                </div>
                <div className="form-group">
                  <label>Service Required</label>
                  <select>
                    <option value="">Select a service...</option>
                    <option>Building Services</option>
                    <option>Construction Materials</option>
                    <option>Construction Consultancy</option>
                    <option>Borehole Drilling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="Describe your project or inquiry..." />
                </div>
                <button className="form-submit">Send Message →</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <Image src="/logo-red-white.png" alt="Phaneroo Constructions Ltd" width={82} height={84} />
            <p>The home of great minds in building. Together we can turn your dreams into reality — from Lilongwe to across Malawi.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map(([h,l]) => <li key={h}><a href={h}>{l}</a></li>)}
            </ul>
          </div>
          <div>
            <h4>Our Services</h4>
            <ul>
              {["Building Services","Concrete Blocks","Interlocking Pavers","Construction Consultancy","Borehole Drilling"].map(s => (
                <li key={s}><a href="#services">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 <span>Phaneroo Constructions Ltd</span>. All rights reserved.</div>
          <div className="reg-info">Reg: COY-ZZFAK8 · National Bank A/C: 1011145309 · Branch: Gateway, Lilongwe</div>
        </div>
      </footer>
    </>
  );
}
