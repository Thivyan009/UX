"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject } from "@/lib/actions/projects"
import { toast } from "@/components/ui/use-toast"

export function CreateProjectForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Web Application",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const form = new FormData()
    form.append("name", formData.name)
    form.append("description", formData.description)
    form.append("type", formData.type)

    const result = await createProject(form)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      router.refresh()
      // Close the dialog by clicking outside or pressing escape
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="E.g., E-commerce Dashboard Redesign"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-type">Project Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web Application">Web Application</SelectItem>
              <SelectItem value="Mobile App">Mobile App</SelectItem>
              <SelectItem value="Desktop Application">Desktop Application</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Project Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Provide context about your project to get more tailored recommendations"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading || !formData.name}>
          {isLoading ? "Creating..." : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  )
}
