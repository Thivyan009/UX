"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid email or password",
    }
  }

  const { email, password } = validatedFields.data

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    // In a real app, you would use a proper session management system
    // For simplicity, we'll use a cookie
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      message: "Login successful",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login",
    }
  }
}

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // In a real app, you would use a proper session management system
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      message: "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

export async function logout() {
  cookies().delete("userId")
  redirect("/login")
}

export async function getCurrentUser() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
