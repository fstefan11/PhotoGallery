import { verifyPassword } from "@/lib/auth";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/model/user-model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userName = token.userName;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
