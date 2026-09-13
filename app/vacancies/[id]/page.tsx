import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicVacancy } from "@/lib/supabase-api";
import styles from "../../content-detail.module.css";

export const dynamic = "force-dynamic";

export default async function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await getPublicVacancy(id).catch(() => null);
  if (!vacancy) notFound();
  return <main className={styles.page}><header className={styles.hero}><div className={styles.heroInner}><span className={styles.tag}>Join our team</span><h1>{vacancy.title}</h1></div></header><article className={styles.main}><Link className={styles.back} href="/#news">← Back to vacancies</Link><div className={styles.jobGrid}><div><p className={styles.meta}>Published {new Date(vacancy.published_at).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}</p><div className={styles.body}><p>{vacancy.description}</p></div></div><aside className={styles.details}><h2>Role details</h2><dl><div><dt>Employment type</dt><dd>{vacancy.employment_type}</dd></div><div><dt>Location</dt><dd>{vacancy.location}</dd></div>{vacancy.closing_date ? <div><dt>Closing date</dt><dd>{new Date(`${vacancy.closing_date}T00:00:00`).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}</dd></div> : null}</dl>{vacancy.application_email ? <a className={styles.apply} href={`mailto:${vacancy.application_email}?subject=${encodeURIComponent(`Application: ${vacancy.title}`)}`}>Apply by email</a> : null}</aside></div></article></main>;
}
