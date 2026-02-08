import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                await connectToDB();

                const user = await User.findOne({ email: credentials.email }).select("+password");

                if(!user) throw new Error("No user found with the given email");

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if(!isPasswordCorrect) throw new Error("Incorrect password");

                // Return minimal session fields
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }){
            await connectToDB();

            if(account.provider === "google") {
                const dbUser = await User.findOne({ email: user.email });

                if(!dbUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        provider: "google",
                    });
                }
            }

            return true;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === "credentials" && user?.id) {
                token.userId = user.id;
                return token;
            }

            if (user?.email || token?.email) {
                await connectToDB();
                const email = user?.email || token?.email;
                const dbUser = await User.findOne({ email });
                if (dbUser) {
                    token.userId = dbUser._id.toString();
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (!session.user) {
                session.user = { name: null, email: null };
            }

            if (token?.userId) {
                session.user.id = token.userId;
            }

            return session;
        },
    },

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
