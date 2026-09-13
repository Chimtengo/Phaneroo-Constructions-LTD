"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publishNews, publishVacancy, uploadNewsImage, type AdminSession } from "@/lib/supabase-api";
import styles from "./admin.module.css";

type ContentType = "news" | "vacancy";

export default function AdminPage() {
  const router = useRouter(); const [session] = useState<AdminSession | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = sessionStorage.getItem("phaneroo-admin-session");
    return saved ? JSON.parse(saved) as AdminSession : null;
  });
  const [type, setType] = useState<ContentType>("news"); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  useEffect(() => { if (!session) router.replace("/admin/login"); }, [router, session]);
  function logout() { sessionStorage.removeItem("phaneroo-admin-session"); router.replace("/admin/login"); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!session) return; setError(""); setMessage(""); setPending(true);
    const form = event.currentTarget; const data = new FormData(form);
    try {
      if (type === "news") {
        const image = data.get("image");
        const imageUrl = image instanceof File && image.size ? await uploadNewsImage(session.access_token, image) : null;
        await publishNews(session.access_token, { title:String(data.get("title")), excerpt:String(data.get("description")), content:String(data.get("content")), category:String(data.get("category")), image_url:imageUrl, is_published:true });
      }
      else await publishVacancy(session.access_token, { title:String(data.get("title")), description:String(data.get("description")), employment_type:String(data.get("employment_type")), location:String(data.get("location")), application_email:String(data.get("application_email")) || null, closing_date:String(data.get("closing_date")) || null, is_published:true });
      form.reset(); setMessage(`${type === "news" ? "News post" : "Vacancy"} published successfully.`);
    } catch (err) { setError(err instanceof Error ? err.message : "Publishing failed. Ensure your user is in admin_users."); }
    finally { setPending(false); }
  }
  if (!session) return null;
  return <main className={styles.shell}><section className={styles.card}>
    <div className={styles.top}><div><p className={styles.eyebrow}>Admin dashboard</p><h1>Publish content</h1><p>Signed in as {session.email}</p></div><button className={styles.logout} onClick={logout}>Sign out</button></div>
    <div className={styles.tabs}><button onClick={() => setType("news")} className={`${styles.tab} ${type === "news" ? styles.tabActive : ""}`}>News post</button><button onClick={() => setType("vacancy")} className={`${styles.tab} ${type === "vacancy" ? styles.tabActive : ""}`}>Vacancy</button></div>
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.field}>Title<input name="title" required minLength={3} maxLength={160} /></label>
      {type === "news" ? <><div className={styles.row}><label className={styles.field}>Category<input name="category" defaultValue="News" required maxLength={40} /></label><label className={styles.field}>News image (optional, max 5 MB)<input name="image" type="file" accept="image/jpeg,image/png,image/webp" /></label></div><label className={styles.field}>Summary<textarea name="description" required minLength={10} maxLength={1000} /></label><label className={styles.field}>Full story<textarea name="content" required minLength={10} maxLength={10000} /></label></> : <><div className={styles.row}><label className={styles.field}>Employment type<select name="employment_type" defaultValue="Full Time"><option>Full Time</option><option>Part Time</option><option>Contract</option><option>Internship</option></select></label><label className={styles.field}>Location<input name="location" defaultValue="Lilongwe" required /></label></div><div className={styles.row}><label className={styles.field}>Application email (optional)<input name="application_email" type="email" /></label><label className={styles.field}>Closing date (optional)<input name="closing_date" type="date" /></label></div><label className={styles.field}>Description<textarea name="description" required minLength={10} maxLength={3000} /></label></>}
      {message ? <p className={styles.notice}>{message}</p> : null}{error ? <p className={styles.error}>{error}</p> : null}<button className={styles.button} disabled={pending}>{pending ? "Publishing…" : `Publish ${type === "news" ? "news" : "vacancy"}`}</button>
    </form>
  </section></main>;
}
