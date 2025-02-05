import Link from "next/link";
import { getAllPosts } from "@/lib/getPosts";
import "../../styles/blog.css";

import { diagnosePostIssues } from "@/lib/blogDiagnostics";

export default function BlogPage() {
  const posts = getAllPosts().sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const issues = diagnosePostIssues();

  // console.log("Diagnostic results:", issues);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      {posts.map((post) => (
        <div key={`${post.year}-${post.month}-${post.day}-${post.slug}`} className="blog-post">
          <h2>
            <Link href={`/${post.year}/${post.month}/${post.day}/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="post-date">{formatDate(post.date)}</p>
          <p>{post.description}</p>
          <Link href={`/${post.year}/${post.month}/${post.day}/${post.slug}`} className="read-more">Read more</Link>
        </div>
      ))}
    </div>
  );
}