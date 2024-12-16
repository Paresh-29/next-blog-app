export const dynamic = "force-dynamic";

import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import { Button } from "flowbite-react";
import Link from "next/link";

export default async function PostPage({ params }) {
  let post = null;
  try {
    const result = await fetch(process.env.URL + "/api/post/get", {
      method: "POST",
      body: JSON.stringify({ slug: params.slug }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await result.json();

    // Log the entire response to see its structure
    console.log("Full API Response:", JSON.stringify(data, null, 2));

    // More flexible checking with 'posts' instead of 'post'
    if (
      !data ||
      !("posts" in data) ||
      !Array.isArray(data.posts) ||
      data.posts.length === 0
    ) {
      throw new Error("Invalid post data structure");
    }

    post = data.posts[0];
    console.log("Extracted Post:", post);
  } catch (error) {
    console.error("Error getting the post:", error);
    post = {
      title: "Post not found",
      content: "The post could not be found",
      category: "",
      image: "",
      createdAt: new Date().toISOString(),
    };
  }

  // Simplified and corrected condition
  if (!post || post.title === "Post not found") {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Page not found
        </h2>
      </main>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title || "Untitled Post"}
      </h1>
      <Link
        href={`/search?category=${post?.category || ""}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post?.category || "Uncategorized"}
        </Button>
      </Link>
      <img
        src={post?.image || "/placeholder-image.jpg"}
        alt={post?.title || "Post Image"}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {post?.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "Date Unknown"}
        </span>
        <span className="italic">
          {post?.content ? (post.content.length / 1000).toFixed(0) : "0"} mins
          read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{
          __html: post?.content || "No content available",
        }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <RecentPosts limit={3} />
    </main>
  );
}
