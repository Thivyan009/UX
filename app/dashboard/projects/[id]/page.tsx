import Link from "next/link"
import { notFound } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUp, BarChart3, Settings, ArrowLeft, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { getProject } from "@/lib/actions/projects"
import { getScreens } from "@/lib/actions/screens"
import prisma from "@/lib/prisma"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  const screens = await getScreens(params.id)

  // Get issue counts
  const issueCountsPromise = prisma.issue.groupBy({
    by: ["severity"],
    where: {
      screen: {
        projectId: params.id,
      },
    },
    _count: {
      id: true,
    },
  })

  const issueCountsResult = await issueCountsPromise

  const issueCounts = {
    critical: issueCountsResult.find((i) => i.severity === "CRITICAL")?._count.id || 0,
    moderate: issueCountsResult.find((i) => i.severity === "MODERATE")?._count.id || 0,
    minor: issueCountsResult.find((i) => i.severity === "MINOR")?._count.id || 0,
  }

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-gray-500">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/projects/${project.id}/upload`}>
              <Button className="gap-2">
                <FileUp className="h-4 w-4" />
                Upload UI
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${project.id}/settings`}>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{project.progress}%</div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Last updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Progress value={project.progress} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">UI Screens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{screens.length}</div>
              <p className="text-sm text-gray-500 mt-1">Screens uploaded and analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Critical</span>
                </div>
                <span className="font-bold">{issueCounts.critical}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Moderate</span>
                </div>
                <span className="font-bold">{issueCounts.moderate}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Minor</span>
                </div>
                <span className="font-bold">{issueCounts.minor}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="screens">
          <TabsList>
            <TabsTrigger value="screens">UI Screens</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="screens" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href={`/dashboard/projects/${project.id}/upload`}>
                <Card className="border-2 border-dashed border-gray-200 bg-gray-50 h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[220px]">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <FileUp className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Upload New Screen</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Add more UI screens to your project for analysis
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {screens.map((screen) => (
                <Card key={screen.id}>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={screen.imageUrl || "/placeholder.svg"}
                        alt={screen.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {screen.issues.length} issues
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{screen.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded on {new Date(screen.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {screen.status}
                        </Badge>
                        <Link href={`/dashboard/projects/${project.id}/screens/${screen.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4">
              {project.reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{report.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          <span>{report.issues.length} issues found</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/reports/${report.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            View Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Link href={`/dashboard/projects/${project.id}/generate-report`}>
                <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px]">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <BarChart3 className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Generate New Report</h3>
                    <p className="text-sm text-gray-500 text-center">Create a new UX audit report for this project</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Activity</CardTitle>
                <CardDescription>Recent activity and changes in this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {screens.map((screen) => (
                    <div key={screen.id} className="flex gap-4">
                      <div className="mt-1 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FileUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{screen.name} screen uploaded and analyzed</p>
                        <p className="text-sm text-gray-500">{new Date(screen.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Project created</p>
                      <p className="text-sm text-gray-500">{new Date(project.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
