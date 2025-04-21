import { notFound } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getProject } from "@/lib/actions/projects"
import { ScreenUploadForm } from "@/components/screen-upload-form"

export default async function ProjectUploadPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
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

        <Card>
          <CardHeader>
            <CardTitle>Add UI Screens to Your Project</CardTitle>
            <CardDescription>
              Upload your UI screens for AI analysis and get detailed UX recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScreenUploadForm projectId={project.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
