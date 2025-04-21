import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, FolderPlus, Clock, FileUp } from "lucide-react"
import { getProjects } from "@/lib/actions/projects"
import { CreateProjectForm } from "@/components/create-project-form"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-gray-500">Manage your UX audit projects</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Create a new project to organize your UI screens and UX audits</DialogDescription>
              </DialogHeader>
              <CreateProjectForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search projects..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[220px]">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Plus className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Create New Project</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Start a new UX audit project for your application
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Create Project</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project to organize your UI screens and UX audits
                    </DialogDescription>
                  </DialogHeader>
                  <CreateProjectForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge
                    variant={project.status === "ACTIVE" ? "outline" : "secondary"}
                    className={
                      project.status === "ACTIVE"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {project.status === "ACTIVE" ? "Active" : "Completed"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <FileUp className="h-4 w-4" />
                    <span>0 screens</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm flex justify-between">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/upload`} className="flex-1">
                    <Button className="w-full gap-2">
                      <FileUp className="h-4 w-4" />
                      Upload UI
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
