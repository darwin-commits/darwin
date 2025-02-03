import { notFound } from "next/navigation";

export default function BlogPost({ params }: { params: { slug: string } }) {
  if (!params.slug) return notFound();
  return <h1>Blog Post: {params.slug}</h1>;
}