import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/home');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/home/dashboard', nextUrl));
      }
      // if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl)); 
      // if (!isLoggedIn) return false; 
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;