import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicNewsPost } from "@/lib/supabase-api";
import styles from "../../content-detail.module.css";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPublicNewsPost(id).catch(() => null);
  if (!post) notFound();
  const heroStyle = post.image_url ? { backgroundImage: `linear-gradient(135deg, rgba(10,25,49,.88), rgba(27,48,79,.62)), url("${post.image_url}")` } : undefined;
  return <main className={styles.page}><header className={styles.hero} style={heroStyle}><div className={styles.heroInner}><span className={styles.tag}>{post.category}</span><h1>{post.title}</h1></div></header><article className={styles.main}><Link className={styles.back} href="/#news">← Back to news</Link><p className={styles.meta}>Published {new Date(post.published_at).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}</p><div className={styles.body}><p>{post.content}</p></div></article></main>;
}
