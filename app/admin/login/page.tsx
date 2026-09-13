"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, supabaseConfigured } from "@/lib/supabase-api";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      const session = await signIn(String(data.get("email")), String(data.get("password")));
      sessionStorage.setItem("phaneroo-admin-session", JSON.stringify(session));
      router.replace("/admin");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); }
    finally { setPending(false); }
  }

  return <main className={styles.shell}><section className={`${styles.card} ${styles.login}`}>
    <p className={styles.eyebrow}>Phaneroo Constructions</p><h1>Admin sign in</h1>
    <p>Sign in to publish news and vacancies.</p>
    {!supabaseConfigured() ? <p className={styles.error}>Supabase has not been configured. Add your values to <code>.env.local</code>.</p> : null}
    <form className={styles.form} onSubmit={handleLogin}>
      <label className={styles.field}>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label className={styles.field}>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      {error ? <p className={styles.error}>{error}</p> : null}
      <button className={styles.button} disabled={pending || !supabaseConfigured()}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  </section></main>;
}
