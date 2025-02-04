import { getPostBySlug } from "@/lib/getPosts";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import "../../../styles/post.css";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(post.content);

  // Format date properly
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", options);
    return formattedDate.replace(/\b(\d{1,2})\b/, "$1th"); // Adds "th" to day
  }

  return (
    <div className="post-container">
      <h1 className="post-title">{post.data.title}</h1>
      <p className="post-date">Darwin • {formatDate(post.data.date)}</p>
      <div className="post-content" dangerouslySetInnerHTML={{ __html: processedContent.toString() }} />
    </div>
  );
}