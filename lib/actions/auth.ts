"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { sucess: false, error: result.error };
    }

    return { sucess: true };
  } catch (error) {
    console.log(error, "Sign IN Error");
    return { sucess: false, error: "SignIn error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { sucess: false, error: "user already Exist" };
  }

  const hashPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashPassword,
      universityCard,
    });

    await signInWithCredentials({ email, password });
    return { sucess: true };
  } catch (error) {
    console.log(error, "Signup Error");
    return { sucess: false, error: "Signup Error" };
  }
};
