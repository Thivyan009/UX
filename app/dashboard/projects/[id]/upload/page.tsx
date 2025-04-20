"use client"

import { Textarea } from "@/components/ui/textarea"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Upload, X, Loader2, ArrowLeft } from "lucide-react"

export default function ProjectUploadPage({ params }: { params: { id: string } }) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // In a real app, you would fetch the project data based on the ID
  const project = {
    id: params.id,
    name: "E-commerce Dashboard",
  }

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
        // In a real app, redirect to the project page
        window.location.href = `/dashboard/projects/${project.id}`
      }, 3000)
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="container p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/dashboard/projects/${project.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload UI Screens</h1>
            <p className="text-gray-500">Project: {project.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Add UI Screens to Your Project</CardTitle>
              <CardDescription>
                Upload your UI screens for AI analysis and get detailed UX recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="screen-type">Screen Type</Label>
                <Select defaultValue="page">
                  <SelectTrigger>
                    <SelectValue placeholder="Select screen type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="modal">Modal</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="screen-name">Screen Name</Label>
                <Input id="screen-name" placeholder="E.g., Homepage, Product Detail, Checkout" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Screen Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide context about this screen to get more tailored recommendations"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Upload UI Screens</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    files.length > 0 ? "border-gray-300" : "border-gray-300 hover:border-purple-500"
                  } transition-colors`}
                >
                  <Input
                    type="file"
                    id="ui-files"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="ui-files" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">Drag & drop files or click to browse</p>
                    <p className="text-sm text-gray-500 mt-1">Support for JPG, PNG, GIF, WebP up to 10MB each</p>
                  </Label>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="text-sm truncate mt-1">{files[index].name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={files.length === 0 || isUploading || isAnalyzing}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing UI...
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4" />
                    Start UX Analysis
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
