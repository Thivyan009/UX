"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Upload, X, Loader2 } from "lucide-react"
import { uploadScreen } from "@/lib/actions/screens"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface ScreenUploadFormProps {
  projectId: string
}

export function ScreenUploadForm({ projectId }: ScreenUploadFormProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "page",
  })

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

    // Simulate upload progress
    const uploadTimer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 30) {
          clearInterval(uploadTimer)
          return 30
        }
        return prev + 5
      })
    }, 200)

    // In a real app, you would upload the file to a storage service
    // For now, we'll just simulate the upload and analysis
    const form = new FormData()
    form.append("name", formData.name)
    form.append("description", formData.description || "")
    form.append("type", formData.type)
    form.append("projectId", projectId)

    // Add the file to the form data
    if (files.length > 0) {
      form.append("file", files[0])
    }

    // Clear the upload timer
    clearInterval(uploadTimer)
    setIsUploading(false)
    setIsAnalyzing(true)

    // Simulate analysis progress
    const analysisTimer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(analysisTimer)
          return 95
        }
        return prev + Math.floor(Math.random() * 10) + 1
      })
    }, 500)

    const result = await uploadScreen(form)

    // Clear the analysis timer
    clearInterval(analysisTimer)
    setAnalysisProgress(100)

    // Short delay to show 100% completion
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisProgress(0)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      router.refresh()
      router.push(`/dashboard/projects/${projectId}`)
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="screen-type">Screen Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
        <Input
          id="screen-name"
          placeholder="E.g., Homepage, Product Detail, Checkout"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Screen Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Provide context about this screen to get more tailored recommendations"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <Label>Upload UI Screen</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            files.length > 0 ? "border-gray-300" : "border-gray-300 hover:border-purple-500"
          } transition-colors`}
        >
          <Input type="file" id="ui-files" className="hidden" accept="image/*" onChange={handleFileChange} />
          <Label htmlFor="ui-files" className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-lg font-medium">Drag & drop file or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Support for JPG, PNG, GIF, WebP up to 10MB</p>
          </Label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-200"
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

      {(isUploading || isAnalyzing) && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{isUploading ? "Uploading..." : "Analyzing UI with Gemini AI..."}</span>
            <span>{analysisProgress}%</span>
          </div>
          <Progress value={analysisProgress} className="h-2" />
          <p className="text-xs text-gray-500 italic">
            {isAnalyzing
              ? "Our AI is analyzing your UI for usability issues, accessibility problems, and design inconsistencies..."
              : "Uploading your UI screen..."}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={files.length === 0 || isUploading || isAnalyzing || !formData.name}
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
    </form>
  )
}
