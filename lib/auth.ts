import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string as string);
const db = client.db("booknook");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  database: mongodbAdapter(db, {
    client,
  }),
});