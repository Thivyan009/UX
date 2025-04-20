"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FolderPlus } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])

      // Create previews for the new files
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setPreviews([...previews, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setIsAnalyzing(true)

      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false)
        // In a real app, redirect to the report page
        window.location.href = "/dashboard/reports/new-report"
      }, 3000)
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="container p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Upload UI Screens</h1>

        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="rounded-full bg-amber-100 p-4 mb-4">
              <FolderPlus className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">Create a Project First</h2>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              To upload and analyze UI screens, you need to create a project first. This helps organize your screens and
              reports.
            </p>
            <Link href="/dashboard/projects">
              <Button className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Create New Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
