import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { compare } from "bcryptjs";



export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email;
        const password = credentials.password;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email and password");
        }

        await connectMongoDB();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Invalid password");
        }

        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          empId: user.empId,
          email: user.email,
          password: user.password,
          id: user._id,
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/onboardingcustomer/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;  // Add user.id to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Add user.id to the token when the user signs in
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
