import { currentUser } from "@clerk/nextjs/server";
import { connect } from "../../../../lib/mongodb/mongoose.js";
import Post from "../../../../lib/models/post.model.js";

export const POST = async (req) => {
	try {
		console.log("Received POST request to create post");

		// Log the entire request for debugging
		const data = await req.json();
		console.log("Request payload:", data);

		const user = await currentUser();
		console.log("Current user:", user);

		if (!user || !user.publicMetadata) {
			console.error("Authentication failed: No user or public metadata");
			return new Response(JSON.stringify({
				error: "User not authenticated",
				details: "No user or public metadata found"
			}), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		await connect();

		const { userMongoId, isAdmin } = user.publicMetadata;
		console.log("User Mongo ID:", userMongoId);
		console.log("Is Admin:", isAdmin);

		// More detailed authorization check
		if (!userMongoId) {
			console.error("Authorization failed: No userMongoId");
			return new Response(JSON.stringify({
				error: "Unauthorized",
				details: "Missing userMongoId"
			}), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (userMongoId !== data.userMongoId) {
			console.error("User ID mismatch", { expected: userMongoId, received: data.userMongoId });
			return new Response(JSON.stringify({
				error: "Unauthorized",
				details: "User ID mismatch"
			}), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		if (isAdmin !== true) {
			console.error("Not an admin user");
			return new Response(JSON.stringify({
				error: "Unauthorized",
				details: "Admin privileges required"
			}), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Slug generation
		const slug = data.title
			.split(" ")
			.join("-")
			.toLowerCase()
			.replace(/[^a-zA-Z0-9-]/g, "");

		// Create Post
		const newPost = await Post.create({
			userId: userMongoId,
			content: data.content,
			title: data.title,
			image: data.image,
			category: data.category,
			slug,
		});

		console.log("Post created successfully:", newPost);

		return new Response(JSON.stringify(newPost), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});

	} catch (error) {
		console.error("Detailed error creating the post:", error);
		return new Response(JSON.stringify({
			error: "Error creating post",
			details: error.message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
