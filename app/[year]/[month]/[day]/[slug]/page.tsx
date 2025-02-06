import { getPostBySlug } from "@/lib/getPosts";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import "../../../../../styles/post.css"

import { use } from "react";

type Params = {
  year: string;
  month: string;
  day: string;
  slug: string;
};

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // Unwrap the Promise

  const post = getPostBySlug(
    resolvedParams.year,
    resolvedParams.month,
    resolvedParams.day,
    resolvedParams.slug
  );

  if (!post) return notFound();

  // Process Markdown content to HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(post.content);

  // Format date
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

    return (
      <div className="post-container">
        <h1 className="post-title">{post.data.title}</h1>
        <p className="post-date">Darwin • {formatDate(post.data.date)}</p>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: processedContent.toString() }} />
    </div>
  );
}