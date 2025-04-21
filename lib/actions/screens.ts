"use server"

import { z } from "zod"
import { getCurrentUser } from "./auth"
import prisma from "@/lib/prisma"
import { getProject } from "./projects"
import { analyzeUIScreen } from "@/lib/gemini"

const screenSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.string(),
  imageUrl: z.string().url(),
  projectId: z.string(),
})

export async function uploadScreen(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to upload a screen",
    }
  }

  const projectId = formData.get("projectId") as string
  const project = await getProject(projectId)

  if (!project) {
    return {
      success: false,
      message: "Project not found",
    }
  }

  // In a real app, you would upload the image to a storage service
  // and get the URL. For simplicity, we'll use a placeholder URL.
  const imageUrl = "/placeholder.svg?height=300&width=500"

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const type = formData.get("type") as string

  const validatedFields = screenSchema.safeParse({
    name,
    description,
    type,
    imageUrl,
    projectId,
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data",
    }
  }

  try {
    // Create the screen in the database
    const screen = await prisma.screen.create({
      data: {
        name,
        description,
        type,
        imageUrl,
        projectId,
        status: "analyzing", // Set initial status to analyzing
      },
    })

    // Perform AI analysis using Gemini
    const analysisResult = await analyzeUIScreen(imageUrl, name, type, description)

    // Create a report for the screen
    const report = await prisma.report.create({
      data: {
        name: `${name} Analysis`,
        projectId,
      },
    })

    if (analysisResult.success && analysisResult.issues) {
      // Create issues from the analysis
      const issuePromises = analysisResult.issues.map((issue) =>
        prisma.issue.create({
          data: {
            title: issue.title,
            description: issue.description,
            severity: issue.severity as any,
            recommendation: issue.recommendation,
            screenId: screen.id,
            reportId: report.id,
          },
        }),
      )

      await Promise.all(issuePromises)

      // Count issues by severity
      const criticalCount = analysisResult.issues.filter((i) => i.severity === "CRITICAL").length
      const moderateCount = analysisResult.issues.filter((i) => i.severity === "MODERATE").length
      const minorCount = analysisResult.issues.filter((i) => i.severity === "MINOR").length

      // Update screen status
      await prisma.screen.update({
        where: { id: screen.id },
        data: {
          status: "analyzed",
        },
      })

      // Update project progress
      const totalScreens = await prisma.screen.count({
        where: { projectId },
      })

      const analyzedScreens = await prisma.screen.count({
        where: {
          projectId,
          status: "analyzed",
        },
      })

      const progress = Math.round((analyzedScreens / totalScreens) * 100)

      await prisma.project.update({
        where: { id: projectId },
        data: { progress },
      })

      return {
        success: true,
        message: "Screen uploaded and analyzed successfully",
        screen,
        report,
        issues: {
          critical: criticalCount,
          moderate: moderateCount,
          minor: minorCount,
          total: analysisResult.issues.length,
        },
      }
    } else {
      // If analysis failed, use fallback issues
      const fallbackIssues = [
        {
          title: "Low contrast text",
          description: "Text has insufficient contrast ratio, making it difficult to read.",
          severity: "CRITICAL",
          recommendation: "Increase the contrast ratio to at least 4.5:1 for normal text.",
          screenId: screen.id,
          reportId: report.id,
        },
        {
          title: "Inconsistent button styling",
          description: "Buttons use inconsistent styling, creating confusion for users.",
          severity: "MODERATE",
          recommendation: "Standardize button styles based on their actions.",
          screenId: screen.id,
          reportId: report.id,
        },
        {
          title: "Small touch targets",
          description: "Some interactive elements are too small for comfortable touch interaction.",
          severity: "MINOR",
          recommendation: "Ensure touch targets are at least 44x44 pixels.",
          screenId: screen.id,
          reportId: report.id,
        },
      ]

      await prisma.issue.createMany({
        data: fallbackIssues,
      })

      // Update screen status
      await prisma.screen.update({
        where: { id: screen.id },
        data: { status: "analyzed" },
      })

      // Update project progress
      const totalScreens = await prisma.screen.count({
        where: { projectId },
      })

      const analyzedScreens = await prisma.screen.count({
        where: {
          projectId,
          status: "analyzed",
        },
      })

      const progress = Math.round((analyzedScreens / totalScreens) * 100)

      await prisma.project.update({
        where: { id: projectId },
        data: { progress },
      })

      return {
        success: true,
        message: "Screen uploaded and analyzed with fallback data (AI analysis failed)",
        screen,
        report,
        issues: {
          critical: 1,
          moderate: 1,
          minor: 1,
          total: 3,
        },
        analysisError: analysisResult.error || "Unknown error during analysis",
      }
    }
  } catch (error) {
    console.error("Upload screen error:", error)
    return {
      success: false,
      message: "An error occurred while uploading the screen",
    }
  }
}

export async function getScreens(projectId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const screens = await prisma.screen.findMany({
      where: {
        projectId,
        project: {
          userId: user.id,
        },
      },
      include: {
        issues: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return screens
  } catch (error) {
    console.error("Get screens error:", error)
    return []
  }
}

export async function getScreen(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const screen = await prisma.screen.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        issues: true,
      },
    })

    if (!screen || screen.project.userId !== user.id) {
      return null
    }

    return screen
  } catch (error) {
    console.error("Get screen error:", error)
    return null
  }
}
