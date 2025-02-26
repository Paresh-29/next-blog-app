// import {
//   clerkMiddleware,
//   createRouteMatcher,
// } from "@clerk/nextjs/server";
// console.log("Middleware loaded, sign-up route configured");
//
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
//
// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
//   if (!userId && isProtectedRoute(req)) {
//     return auth().redirectToSignIn();
//   }
// });
//
// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

console.log("Middleware loaded, sign-up route configured");

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    if (!userId && isProtectedRoute(req)) {
      return auth().redirectToSignIn();
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    throw error;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
