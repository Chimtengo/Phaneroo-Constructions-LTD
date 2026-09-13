export type NewsPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string;
};

export type Vacancy = {
  id: string;
  title: string;
  description: string;
  employment_type: string;
  location: string;
  application_email: string | null;
  closing_date: string | null;
  is_published: boolean;
  published_at: string;
};

export type AdminSession = { access_token: string; email: string };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function configured() {
  return Boolean(url && key);
}

function headers(token?: string) {
  return {
    apikey: key ?? "",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  if (!configured()) throw new Error("Supabase is not configured yet.");
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: { ...headers(token), ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || body.error_description || "Supabase request failed.");
  }
  return response.json() as Promise<T>;
}

export const supabaseConfigured = configured;

export async function getPublicContent() {
  const [news, vacancies] = await Promise.all([
    request<NewsPost[]>("/rest/v1/news_posts?select=*&is_published=eq.true&order=published_at.desc"),
    request<Vacancy[]>("/rest/v1/vacancies?select=*&is_published=eq.true&order=published_at.desc"),
  ]);
  return { news, vacancies };
}

export async function getPublicNewsPost(id: string) {
  const posts = await request<NewsPost[]>(`/rest/v1/news_posts?select=*&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`);
  return posts[0] ?? null;
}

export async function getPublicVacancy(id: string) {
  const vacancies = await request<Vacancy[]>(`/rest/v1/vacancies?select=*&id=eq.${encodeURIComponent(id)}&is_published=eq.true&limit=1`);
  return vacancies[0] ?? null;
}

export async function signIn(email: string, password: string): Promise<AdminSession> {
  const session = await request<{ access_token: string; user: { email: string } }>(
    "/auth/v1/token?grant_type=password",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  return { access_token: session.access_token, email: session.user.email };
}

export async function uploadNewsImage(token: string, file: File) {
  if (!configured()) throw new Error("Supabase is not configured yet.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
  const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const path = `news/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/news-images/${path}`, {
    method: "POST",
    headers: { apikey: key ?? "", Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" },
    body: file,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Image upload failed.");
  }
  return `${url}/storage/v1/object/public/news-images/${path}`;
}

export async function publishNews(token: string, post: Omit<NewsPost, "id" | "published_at">) {
  return request<NewsPost[]>("/rest/v1/news_posts", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(post),
  }, token);
}

export async function publishVacancy(token: string, vacancy: Omit<Vacancy, "id" | "published_at">) {
  return request<Vacancy[]>("/rest/v1/vacancies", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(vacancy),
  }, token);
}
