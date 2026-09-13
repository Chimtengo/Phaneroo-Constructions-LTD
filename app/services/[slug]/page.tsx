import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/services";
import styles from "../service.module.css";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <main className={styles.page}>
    <section className={styles.hero}><div className={styles.wrap}><Link className={styles.back} href="/#services">← Back to services</Link><div className={styles.heroGrid}><div><div className={styles.eyebrow}>Phaneroo Constructions</div><h1>{service.title}</h1><p>{service.description}</p></div><div className={styles.iconGlass} aria-hidden="true">{service.icon}</div></div></div></section>
    <section className={styles.content}><div className={styles.wrap}><div className={styles.glass}><p className={styles.intro}>{service.summary}</p><div className={styles.grid}><section className={styles.panel}><h2>What we provide</h2><ul className={styles.list}>{service.services.map((item) => <li key={item}>{item}</li>)}</ul></section><section className={styles.panel}><h2>Why work with us</h2><ul className={styles.list}>{service.benefits.map((item) => <li key={item}>{item}</li>)}</ul></section></div><div className={styles.cta}><div><h2>Planning a project?</h2><p>Tell us about your requirements and our team will help you take the next step.</p></div><Link href="/#contact">Request a quote →</Link></div></div></div></section>
  </main>;
}
