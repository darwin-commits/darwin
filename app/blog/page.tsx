import Link from "next/link";
import { getAllPosts } from "@/lib/getPosts";
import "../../styles/blog.css";

export default function BlogPage() {
  const posts = getAllPosts();

  // Function to format date as day month year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      {posts.map((post) => (
        <div key={post.slug} className="blog-post">
          <h2>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="post-date">{formatDate(post.date)}</p>
          <p>{post.description}</p>
          <Link href={`/blog/${post.slug}`} className="read-more">Read more</Link>
        </div>
      ))}
    </div>
  );
}