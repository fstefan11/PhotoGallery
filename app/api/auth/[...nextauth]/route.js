import { verifyPassword } from "@/lib/auth";
import { dbConnect } from "@/lib/mongo";
import { User } from "@/model/user-model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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

        return { email: user.email };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
