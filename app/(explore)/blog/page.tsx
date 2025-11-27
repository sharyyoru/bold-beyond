import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchSanity, queries } from "@/lib/sanity";

type BlogPost = {
  _id: string;
  title: string;
  slug?: { current: string };
  excerpt?: string;
  publishedAt?: string;
  readTime?: number;
  categories?: string[];
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await fetchSanity<BlogPost[]>(queries.allBlogPosts);
  const visible = posts.filter((p) => p.slug?.current);
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          Blog
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Stories and tools for modern wellbeing
        </h1>
        <p className="text-muted-foreground text-base">
          Curated insights from our experts on mental health, lifestyle, and the
          science behind feeling better.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Card
            key={post._id}
            className="group h-full border-muted/70 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {post.categories?.[0]}
              </p>
              <CardTitle className="mt-1 text-base font-semibold">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-muted-foreground">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between px-6 pb-4 pt-0 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {typeof post.readTime === "number" && (
                  <span>{post.readTime} min read</span>
                )}
              </div>
              <Link
                href={`/blog/${post.slug!.current}`}
                className="inline-flex items-center text-sm font-medium text-brand-gold hover:underline"
              >
                Read article
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
