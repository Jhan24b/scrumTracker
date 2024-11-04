"use server"

import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/usuarios";

export const login = async (email: string, password: string) => {
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      return { user };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};