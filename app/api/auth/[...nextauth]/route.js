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
        token.id = user._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      await dbConnect();
      const user = await User.findById(token.id);
      if (!user) {
        throw new Error("User no longer exists");
      }
      if (token) {
        session.user.id = user._id.toString();
        session.user.userName = user.userName;
        session.user.profilePic = user.profilePic;
        session.user.role = user.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
