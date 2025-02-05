import { getPostBySlug } from "@/lib/getPosts";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import "../../../styles/post.css";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Wait for params.slug to be available before using it
  const { slug } = await Promise.resolve(params); 

  // Fetch post
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  // Process Markdown content to HTML
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(post.content);

  // Format date properly
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