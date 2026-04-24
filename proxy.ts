import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/','/about', '/dashboard/settings', '/dashboard/interviews', '/dashboard/interviews/session', '/dashboard/japanese-sensei', '/dashboard' , '/privacy', '/api/generate-cv', '/api/interviews', '/services', '/dashboard/cv-builder' , '/dashboard/settings', '/sign-up(.*)', '/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};