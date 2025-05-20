import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"; // Needed for custom access token signing

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // When logging in
      if (account && user) {
        token.sub = user.id || account.providerAccountId;
        token.email = user.email;
        token.name = user.name;

        // Generate a JWT accessToken signed with NEXTAUTH_SECRET
        token.accessToken = jwt.sign(
          { sub: token.sub, email: user.email },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: "1h" }
        );
      }

      return token;
    },

    async session({ session, token }) {
      session.user.sub = token.sub;
      session.user.email = token.email;
      session.user.name = token.name;
      session.accessToken = token.accessToken; // Make accessToken available on client
      return session;
    },
  },
});

export { handler as GET, handler as POST };
