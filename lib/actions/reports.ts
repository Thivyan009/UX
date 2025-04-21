"use server"

import { getCurrentUser } from "./auth"
import prisma from "@/lib/prisma"

export async function getReports() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  try {
    const reports = await prisma.report.findMany({
      where: {
        project: {
          userId: user.id,
        },
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return reports
  } catch (error) {
    console.error("Get reports error:", error)
    return []
  }
}

export async function getReport(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  try {
    const report = await prisma.report.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        issues: {
          include: {
            screen: true,
          },
        },
      },
    })

    if (!report || report.project.userId !== user.id) {
      return null
    }

    return report
  } catch (error) {
    console.error("Get report error:", error)
    return null
  }
}

export async function generateReport(projectId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to generate a report",
    }
  }

  const name = formData.get("name") as string

  if (!name) {
    return {
      success: false,
      message: "Report name is required",
    }
  }

  try {
    // Get all screens for the project
    const screens = await prisma.screen.findMany({
      where: {
        projectId,
        project: {
          userId: user.id,
        },
      },
    })

    if (screens.length === 0) {
      return {
        success: false,
        message: "No screens found for this project",
      }
    }

    // Create a new report
    const report = await prisma.report.create({
      data: {
        name,
        projectId,
      },
    })

    // For each screen, create some sample issues
    for (const screen of screens) {
      const issues = [
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
        data: issues,
      })
    }

    return {
      success: true,
      message: "Report generated successfully",
      report,
    }
  } catch (error) {
    console.error("Generate report error:", error)
    return {
      success: false,
      message: "An error occurred while generating the report",
    }
  }
}
