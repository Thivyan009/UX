"use server"

import { z } from "zod"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "./auth"

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.string(),
})

export async function createProject(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create a project",
    }
  }

  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
    }
  }

  const { name, description, type } = validatedFields.data

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        type,
        userId: user.id,
      },
    })

    return {
      success: true,
      message: "Project created successfully",
      project,
    }
  } catch (error) {
    console.error("Create project error:", error)
    return {
      success: false,
      message: "An error occurred while creating the project",
    }
  }
}

export async function getProjects() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return projects
  } catch (error) {
    console.error("Get projects error:", error)
    return []
  }
}

export async function getProject(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        screens: true,
        reports: {
          include: {
            issues: true,
          },
        },
      },
    })

    return project
  } catch (error) {
    console.error("Get project error:", error)
    return null
  }
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to update a project",
    }
  }

  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
    }
  }

  const { name, description, type } = validatedFields.data

  try {
    const project = await prisma.project.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name,
        description,
        type,
      },
    })

    return {
      success: true,
      message: "Project updated successfully",
      project,
    }
  } catch (error) {
    console.error("Update project error:", error)
    return {
      success: false,
      message: "An error occurred while updating the project",
    }
  }
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to delete a project",
    }
  }

  try {
    await prisma.project.delete({
      where: {
        id,
        userId: user.id,
      },
    })

    return {
      success: true,
      message: "Project deleted successfully",
    }
  } catch (error) {
    console.error("Delete project error:", error)
    return {
      success: false,
      message: "An error occurred while deleting the project",
    }
  }
}
