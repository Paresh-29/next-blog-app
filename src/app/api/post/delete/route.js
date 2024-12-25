import Post from '../../../../lib/models/post.model';
import { connect } from '../../../../lib/mongodb/mongoose';
import { currentUser } from '@clerk/nextjs/server';

export const DELETE = async (req) => {
  try {
    const user = await currentUser();

    // Connect to the database
    await connect();

    // Parse the request body
    const data = await req?.json();

    // Validate request data
    if (!data || !data.postId || !data.userId) {
      return new Response(JSON.stringify({ message: 'Invalid request data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check user authorization
    const isAuthorized = user.publicMetadata.isAdmin && user.publicMetadata.userMongoId === data.userId;
    if (!isAuthorized) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Perform the deletion
    const deletedPost = await Post.findByIdAndDelete(data.postId);
    if (!deletedPost) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ message: 'An error occurred while deleting the post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

