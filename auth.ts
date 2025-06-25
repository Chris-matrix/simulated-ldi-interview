import NextAuth from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export { handlers, auth, signIn, signOut };
