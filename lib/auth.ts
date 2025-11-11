import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";

const rows = await db.select().from(user).limit(1);
const exists = rows.length > 0;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  url: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(
    db,
    {
      schema: {
        account, session, user, verification
      },
      provider: "sqlite",
    }
  ),
  user: {
    deleteUser: {
      enabled: true,
      // Optional: beforeDelete, afterDelete callbacks
    }
  },
  // Extend user object (Better Auth configuration)
  // user: {
  //   additionalFields: {
  //     role: {
  //       type: "string",
  //       defaultValue: "admin",
  //     },
  //   },
  // },
  // enable only email/password for now
  emailAndPassword: {
    enabled: true,
    disableSignUp: exists,
    autoSignIn: true,
  },
  // // optional: cookie/session options
  // session: {
  //   // default settings; adapter will manage session table
  //   freshAge: 60 * 60 * 24 * 30, // 30 days
  // },
  plugins: [
    // This plugin is essential for server actions to set cookies
    nextCookies(),
  ],
});

export const getServerSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
}
