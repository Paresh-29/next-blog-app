# Personal Blog App

A simple personal blog app built with Next.js, Firebase, MongoDB, and Clerk. The app allows admin users to create and manage blog posts with image uploads. Clerk is used for user authentication, and Firebase is used for media storage. The platform provides a clean and user-friendly interface for managing content.

## Features

- **Post Creation**: Admin users can create blog posts with a title, content, and image upload.
- **Image Upload**: Images can be uploaded to Firebase and associated with blog posts.
- **Admin Dashboard**: Admins can manage and view posts.
- **User Authentication**: Clerk is used for secure user authentication, allowing only admins to create posts.
- **Simple UI**: A clean and user-friendly interface for creating and managing posts.
- **Firebase Integration**: Firebase is used for image uploads.
- **MongoDB Integration**: Data, including posts and user information, is stored in MongoDB.
- **Clerk Integration**: Clerk is used to manage user sign-up, login, and authentication, ensuring that only authorized users can access the post creation feature.

## Getting Started

To get started, follow these steps:

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Paresh-29/next-blog-app.git
   ```

2. Install dependencies:
   ```bash
   cd next-blog-app
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of the project and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   WEBHOOK_SECRET=your_webhook_secret
   CLERK_FRONTEND_API=your_clerk_frontend_api
   CLERK_API_KEY=your_clerk_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
