"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const services = [
    { icon: "🏗️", title: "Building Services", desc: "From residential homes to large commercial and industrial structures — we manage every phase from foundation to finishing." },
    { icon: "🧱", title: "Construction Materials", desc: "Machine-manufactured concrete blocks and interlocking pavers, produced on-site to cut transport costs and ensure quality." },
    { icon: "📐", title: "Construction Consultancy", desc: "Expert design input, engineering solutions, and project management services that turn visions into lasting structures." },
    { icon: "💧", title: "Borehole Drilling", desc: "Professional borehole drilling and complete water installation services for residential, commercial and institutional clients." },
  ];

  const projects = [
    { title: "Dept. of Forestry", value: "MK 10M+", desc: "General building project for the Department of Forestry in Lilongwe.", img: "project1" },
    { title: "Mwala CCAP Church", value: "MK 12M+", desc: "Supply of concrete blocks for church construction project.", img: "project2" },
    { title: "Lilongwe City Council", value: "MK 162M+", desc: "Supply of 90,000+ concrete blocks for Chilinde Newlines Market.", img: "project3" },
    { title: "Kabudula Pig Farm", value: "MK Multi-M", desc: "Construction of a livestock facility in Lilongwe District.", img: "project4" },
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

        /* NAV */
        nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.25rem 2rem;
          transition:background 0.4s, padding 0.4s, box-shadow 0.4s;
        }
        nav.scrolled { background:var(--navy); padding:0.75rem 2rem; box-shadow:0 2px 24px rgba(0,0,0,0.35); }
        .nav-logo { display:flex; align-items:center; text-decoration:none; }
        .nav-links { display:flex; gap:2rem; list-style:none; margin:0; padding:0; }
        .nav-links a {
          color:rgba(255,255,255,0.85); text-decoration:none;
          font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;
          transition:color 0.2s; position:relative; padding-bottom:3px;
        }
        .nav-links a::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:var(--red); transition:width 0.3s; }
        .nav-links a:hover { color:white; }
        .nav-links a:hover::after { width:100%; }
        .nav-cta { background:var(--red) !important; color:white !important; padding:0.5rem 1.25rem !important; border-radius:4px; }
        .nav-cta::after { display:none !important; }
        .nav-cta:hover { background:#a50019 !important; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
        .hamburger span { width:26px; height:2px; background:white; display:block; }
        .mobile-menu { display:none; position:fixed; inset:0; background:var(--navy); z-index:199; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; }
        .mobile-menu.open { display:flex; animation:fadeIn 0.3s ease; }
        .mobile-menu a { color:white; text-decoration:none; font-size:1.6rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; }
        .mobile-close { position:absolute; top:1.5rem; right:2rem; background:none; border:none; color:white; font-size:2rem; cursor:pointer; }

        /* HERO */
        .hero { min-height:100vh; position:relative; overflow:hidden; display:flex; align-items:center; }
        .hero-bg { position:absolute; inset:0; z-index:0; }
        .hero-bg img { width:100%; height:100%; object-fit:cover; object-position:center; }
        .hero-overlay { position:absolute; inset:0; z-index:1; background:linear-gradient(135deg, rgba(10,20,40,0.92) 40%, rgba(10,20,40,0.65) 100%); }
        .hero-slash { position:absolute; bottom:-2px; left:0; right:0; height:80px; z-index:3; background:white; clip-path:polygon(0 100%,100% 0,100% 100%); }
        .hero-content { position:relative; z-index:4; max-width:1200px; margin:0 auto; padding:9rem 2rem 7rem; width:100%; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:0.75rem; color:var(--red); font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.18em; margin-bottom:1.75rem; animation:slideRight 0.8s ease both; }
        .hero-eyebrow::before { content:''; width:36px; height:2px; background:var(--red); }
        h1 { font-size:clamp(3rem,7.5vw,6rem); font-weight:900; color:white; line-height:0.95; text-transform:uppercase; letter-spacing:-0.02em; margin-bottom:1.5rem; animation:slideUp 0.9s ease 0.2s both; }
        h1 em { color:var(--red); font-style:normal; display:block; }
        .hero-sub { color:rgba(255,255,255,0.65); font-size:1.05rem; max-width:500px; line-height:1.75; margin-bottom:2.5rem; animation:slideUp 0.9s ease 0.4s both; }
        .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; animation:slideUp 0.9s ease 0.6s both; }
        .hero-badge { position:absolute; right:2rem; bottom:6rem; z-index:4; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); border-radius:12px; padding:1.25rem 1.75rem; text-align:center; backdrop-filter:blur(12px); animation:fadeIn 1.2s ease 1s both; }
        .hero-badge strong { display:block; color:var(--red); font-size:2rem; font-weight:900; }
        .hero-badge span { color:rgba(255,255,255,0.5); font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; }

        /* BUTTONS */
        .btn-primary { background:var(--red); color:white; padding:1rem 2rem; border-radius:4px; font-weight:700; font-size:0.88rem; text-transform:uppercase; letter-spacing:0.08em; text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem; transition:transform 0.25s, box-shadow 0.25s, background 0.25s; }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(200,0,30,0.45); background:#a50019; }
        .btn-outline { border:2px solid rgba(255,255,255,0.4); color:white; padding:1rem 2rem; border-radius:4px; font-weight:700; font-size:0.88rem; text-transform:uppercase; letter-spacing:0.08em; text-decoration:none; display:inline-block; transition:border-color 0.25s, background 0.25s, transform 0.25s; }
        .btn-outline:hover { border-color:white; background:rgba(255,255,255,0.1); transform:translateY(-3px); }

        /* STATS */
        .stats { background:white; border-bottom:1px solid var(--light); padding:4rem 2rem; }
        .stats-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; text-align:center; }
        .stat-item { padding:1.5rem; position:relative; }
        .stat-item:not(:last-child)::after { content:''; position:absolute; right:0; top:20%; height:60%; width:1px; background:var(--light); }
        .stat-num { font-size:clamp(2.5rem,5vw,3.8rem); font-weight:900; color:var(--navy); line-height:1; }
        .stat-num em { color:var(--red); font-style:normal; }
        .stat-label { font-size:0.73rem; font-weight:700; text-transform:uppercase; letter-spacing:0.14em; color:var(--gray); margin-top:0.5rem; }

        /* COMMON SECTION */
        section { padding:6rem 2rem; }
        .section-inner { max-width:1200px; margin:0 auto; }
        .section-tag { display:inline-flex; align-items:center; gap:0.6rem; color:var(--red); font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.18em; margin-bottom:0.75rem; }
        .section-tag::before { content:''; width:28px; height:2px; background:var(--red); }
        h2 { font-size:clamp(2rem,4vw,3rem); font-weight:900; color:var(--navy); text-transform:uppercase; line-height:1.05; letter-spacing:-0.01em; }

        /* ABOUT */
        .about { background:var(--concrete); }
        .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
        .about-text h2 { margin-bottom:1.5rem; }
        .about-text p { color:var(--gray); line-height:1.85; margin-bottom:1rem; }
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

        /* SERVICES */
        .services { background:white; }
        .services-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; margin-top:3rem; }
        .service-card { border:2px solid var(--light); border-radius:10px; padding:2.25rem; transition:all 0.35s; cursor:default; position:relative; overflow:hidden; background:white; }
        .service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--red); transform:scaleX(0); transform-origin:left; transition:transform 0.35s; }
        .service-card:hover { border-color:transparent; box-shadow:0 12px 40px rgba(26,43,74,0.12); transform:translateY(-4px); }
        .service-card:hover::before { transform:scaleX(1); }
        .service-icon { font-size:2.8rem; margin-bottom:1.25rem; display:block; }
        .service-card h3 { font-size:1rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--navy); margin-bottom:0.75rem; }
        .service-card p { color:var(--gray); line-height:1.75; font-size:0.9rem; }

        /* PRODUCTS */
        .products { background:var(--navy); }
        .products .section-tag { color:var(--red); }
        .products-intro { color:rgba(255,255,255,0.5); margin-top:0.5rem; margin-bottom:3rem; }
        .products-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
        .product-card { position:relative; border-radius:10px; overflow:hidden; height:360px; cursor:default; }
        .product-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s ease; }
        .product-card:hover img { transform:scale(1.08); }
        .product-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(10,20,40,0.95) 0%, rgba(10,20,40,0.4) 55%, rgba(10,20,40,0.05) 100%);
          display:flex; flex-direction:column; justify-content:flex-end; padding:2rem;
          transition:background 0.4s ease;
        }
        .product-card:hover .product-overlay {
          background:linear-gradient(to top, rgba(200,0,30,0.92) 0%, rgba(26,43,74,0.82) 60%, rgba(10,20,40,0.2) 100%);
        }
        .product-overlay-icon {
          font-size:2.5rem; margin-bottom:0.75rem;
          opacity:0; transform:translateY(12px);
          transition:opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s;
        }
        .product-card:hover .product-overlay-icon { opacity:1; transform:translateY(0); }
        .product-overlay h3 {
          color:white; font-size:1.2rem; font-weight:900;
          text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.5rem;
          transform:translateY(8px); transition:transform 0.4s ease;
        }
        .product-card:hover .product-overlay h3 { transform:translateY(0); }
        .product-overlay p {
          color:rgba(255,255,255,0.8); font-size:0.85rem; line-height:1.6; max-width:340px;
          opacity:0; transform:translateY(10px);
          transition:opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }
        .product-card:hover .product-overlay p { opacity:1; transform:translateY(0); }

        /* PROJECTS */
        .projects { background:var(--concrete); }
        .projects-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; margin-top:3rem; }
        .project-card { position:relative; border-radius:10px; overflow:hidden; height:340px; cursor:default; box-shadow:0 4px 20px rgba(26,43,74,0.12); }
        .project-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s ease; }
        .project-card:hover img { transform:scale(1.08); }
        .project-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(10,20,40,0.95) 0%, rgba(10,20,40,0.4) 55%, rgba(10,20,40,0.05) 100%);
          display:flex; flex-direction:column; justify-content:flex-end; padding:2rem;
          transition:background 0.4s ease;
        }
        .project-card:hover .project-overlay {
          background:linear-gradient(to top, rgba(26,43,74,0.97) 0%, rgba(26,43,74,0.8) 55%, rgba(10,20,40,0.2) 100%);
        }
        .project-value {
          font-size:2rem; font-weight:900; color:var(--red); line-height:1;
          transform:translateY(6px); transition:transform 0.4s ease;
        }
        .project-card:hover .project-value { transform:translateY(0); }
        .project-overlay h3 {
          color:white; font-size:0.88rem; font-weight:800;
          text-transform:uppercase; letter-spacing:0.06em;
          margin-top:0.4rem; margin-bottom:0;
          transform:translateY(6px); transition:transform 0.4s ease 0.05s;
        }
        .project-card:hover .project-overlay h3 { transform:translateY(0); }
        .project-overlay p {
          color:rgba(255,255,255,0.72); font-size:0.84rem; line-height:1.65;
          margin-top:0.6rem; max-width:340px;
          opacity:0; transform:translateY(12px);
          transition:opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
        }
        .project-card:hover .project-overlay p { opacity:1; transform:translateY(0); }

        /* WHY */
        .why { background:white; }
        .why-grid { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
        .why-list { list-style:none; display:flex; flex-direction:column; gap:1rem; padding:0; }
        .why-item { display:flex; gap:1rem; align-items:flex-start; background:var(--concrete); border-radius:8px; padding:1.25rem 1.5rem; border-left:4px solid var(--red); transition:transform 0.25s, box-shadow 0.25s; }
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

        /* CONTACT */
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

        /* FOOTER */
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

        /* KEYFRAMES */
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        /* MOBILE */
        @media (max-width:768px) {
          .nav-links { display:none; }
          .hamburger { display:flex; }
          .hero-badge { display:none; }
          .about-grid, .services-grid, .products-grid, .projects-grid, .why-grid, .contact-grid { grid-template-columns:1fr; gap:2.5rem; }
          .about-img-wrap { padding-bottom:1rem; padding-right:0; }
          .about-card { position:static; margin-top:1rem; }
          .about-accent { display:none; }
          .stats-inner { grid-template-columns:1fr; }
          .stat-item::after { display:none; }
          .footer-inner { grid-template-columns:1fr; gap:2rem; }
          .footer-bottom { flex-direction:column; gap:0.5rem; text-align:center; }
          section { padding:4rem 1.5rem; }
          h1 { font-size:2.6rem; }
          .hero-content { padding:7rem 1.5rem 5rem; }
          .product-card { height:280px; }
          .project-card { height:260px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#home" className="nav-logo">
          <Image
            src="/logo.jpg"
            alt="Phaneroo Constructions Ltd"
            width={140} height={44} priority
            style={{ height:44, width:"auto", filter:"brightness(0) invert(1)" }}
          />
        </a>
        <ul className="nav-links">
          {[["#about","About"],["#services","Services"],["#products","Products"],["#projects","Projects"],["#why","Why Us"]].map(([h,l]) => (
            <li key={h}><a href={h}>{l}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">Contact Us</a></li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {[["#about","About"],["#services","Services"],["#products","Products"],["#projects","Projects"],["#why","Why Us"],["#contact","Contact"]].map(([h,l]) => (
          <a key={h} href={h} onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-bg">
          <Image
            src="/images/hero.jpeg"
            alt="Phaneroo Constructions"
            fill priority
            style={{ objectFit:"cover", objectPosition:"center" }}
          />
        </div>
        <div className="hero-overlay" />

        {/* Parallax stripes */}
        <div style={{ position:"absolute", top:0, right:"8%", width:3, bottom:0, zIndex:3, background:"var(--red)", opacity:0.5, transform:`translateY(${scrollY * 0.12}px)`, transition:"transform 0.05s linear" }} />
        <div style={{ position:"absolute", top:0, right:"13%", width:1, bottom:0, zIndex:3, background:"rgba(255,255,255,0.07)", transform:`translateY(${scrollY * 0.07}px)`, transition:"transform 0.05s linear" }} />

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

      {/* ── STATS ── */}
      <div className="stats">
        <div className="stats-inner">
          {[
            { target:50, suffix:"+", label:"Projects Completed" },
            { target:162, suffix:"M+", label:"MK Largest Contract" },
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

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <Reveal direction="left">
              <div className="about-text">
                <div className="section-tag">About Us</div>
                <h2>Building More Than Structures</h2>
                <p style={{marginTop:"1.25rem"}}>
                  Founded in 2020 by visionary leader Ranwell Fatsani Mwale, Phaneroo Constructions Ltd
                  began as a general contractor tackling challenging projects across Malawi.
                  Today, we&apos;ve grown into a comprehensive construction solutions provider.
                </p>
                <p>
                  We are strategically positioned to capitalize on Malawi&apos;s booming construction sector —
                  offering everything from machine-manufactured building materials to full project management
                  and engineering consultation.
                </p>
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

      {/* ── SERVICES ── */}
      <section className="services" id="services">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">What We Offer</div>
            <h2>Our Services</h2>
            <p style={{color:"var(--gray)",marginTop:"0.75rem",maxWidth:560,lineHeight:1.75}}>
              From foundations to finishing touches — your one-stop construction partner.
            </p>
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

      {/* ── PRODUCTS ── */}
      <section className="products" id="products">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Our Products</div>
            <h2 style={{color:"white"}}>Premium Building Materials</h2>
            <p className="products-intro">
              Machinery-manufactured, highly rigid, vibration-resistant and highly durable.
            </p>
          </Reveal>
          <div className="products-grid">
            {[
              { file:"blocks.jpg", title:"Concrete Blocks", icon:"🧱", desc:"Machine-manufactured, highly rigid and vibration-resistant. Available in multiple sizes." },
              { file:"interlocking.jpg", title:"Interlocking Pavers", icon:"🔲", desc:"Diverse designs for driveways, walkways and outdoor spaces. Durable and environmentally friendly." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 150} direction="up">
                <div className="product-card">
                  <Image src={`/images/${p.file}`} alt={p.title} width={600} height={360} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  <div className="product-overlay">
                    <div className="product-overlay-icon">{p.icon}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="projects" id="projects">
        <div className="section-inner">
          <Reveal>
            <div className="section-tag">Track Record</div>
            <h2>Notable Projects</h2>
            <p style={{color:"var(--gray)",marginTop:"0.75rem",maxWidth:560,lineHeight:1.75}}>
              From government contracts to institutional and commercial projects — our work speaks for itself.
            </p>
          </Reveal>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 100} direction="up">
                <div className="project-card">
                  <Image src={`/images/${p.img}.jpg`} alt={p.title} width={600} height={340} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  <div className="project-overlay">
                    <div className="project-value">{p.value}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
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
                  <Image src="/logo.png" alt="Phaneroo Constructions" width={160} height={50}
                    style={{ height:50, width:"auto", filter:"brightness(0) invert(1)", opacity:0.55 }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact" id="contact">
        <div className="section-inner">
          <div className="contact-grid">
            <Reveal direction="left">
              <div>
                <div className="section-tag">Get In Touch</div>
                <h2>Let&apos;s Build Something Great</h2>
                <p className="contact-text" style={{marginTop:"1rem"}}>
                  Ready to start your project? Whether it&apos;s a home, commercial facility, or you need
                  quality building materials — we&apos;d love to hear from you.
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

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <Image src="/logo.png" alt="Phaneroo Constructions Ltd" width={160} height={48}
              style={{ height:48, width:"auto", filter:"brightness(0) invert(1)" }} />
            <p>The home of great minds in building. Together we can turn your dreams into reality — from Lilongwe to across Malawi.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              {[["#about","About"],["#services","Services"],["#products","Products"],["#projects","Projects"],["#why","Why Us"],["#contact","Contact"]].map(([h,l]) => (
                <li key={h}><a href={h}>{l}</a></li>
              ))}
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