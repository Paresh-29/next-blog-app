'use client';

import { useUser } from '@clerk/nextjs';
import { Button, Modal, Table } from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { user, isSignedIn } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user?.publicMetadata?.userMongoId) return;

        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.publicMetadata.userMongoId }),
        });

        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchPosts();
    }
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postIdToDelete,
          userId: user?.publicMetadata?.userMongoId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setPostIdToDelete('');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  if (!isSignedIn || !user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {userPosts.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPosts.map((post) => (
              <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link href={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title || 'Post image'}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/post/${post.slug}`}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/dashboard/update-post/${post._id}`}
                    className="text-teal-500 hover:underline"
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-center text-gray-500">You have no posts yet.</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
