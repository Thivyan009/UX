"use client"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUp, BarChart3, Settings, ArrowLeft, Clock, AlertCircle, CheckCircle } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the project data based on the ID
  const project = {
    id: params.id,
    name: "E-commerce Dashboard",
    description: "Redesign of the main admin dashboard for our e-commerce platform",
    type: "Web Application",
    createdAt: "April 15, 2025",
    lastUpdated: "2 days ago",
    status: "active",
    progress: 80,
    screens: [
      {
        id: "screen-1",
        name: "Homepage",
        uploadedAt: "April 15, 2025",
        status: "analyzed",
        issues: 4,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Homepage",
      },
      {
        id: "screen-2",
        name: "Product Page",
        uploadedAt: "April 16, 2025",
        status: "analyzed",
        issues: 3,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Product",
      },
      {
        id: "screen-3",
        name: "Checkout",
        uploadedAt: "April 17, 2025",
        status: "analyzed",
        issues: 5,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Checkout",
      },
      {
        id: "screen-4",
        name: "User Profile",
        uploadedAt: "April 18, 2025",
        status: "analyzed",
        issues: 2,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Profile",
      },
      {
        id: "screen-5",
        name: "Settings",
        uploadedAt: "April 19, 2025",
        status: "analyzed",
        issues: 1,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Settings",
      },
    ],
    issues: {
      critical: 3,
      moderate: 6,
      minor: 3,
    },
    reports: [
      {
        id: "report-1",
        name: "Initial UX Audit",
        date: "April 17, 2025",
        screens: 3,
      },
      {
        id: "report-2",
        name: "Follow-up Analysis",
        date: "April 19, 2025",
        screens: 2,
      },
    ],
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
                  <span>Last updated {project.lastUpdated}</span>
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
              <div className="text-3xl font-bold">{project.screens.length}</div>
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
                <span className="font-bold">{project.issues.critical}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Moderate</span>
                </div>
                <span className="font-bold">{project.issues.moderate}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Minor</span>
                </div>
                <span className="font-bold">{project.issues.minor}</span>
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

              {project.screens.map((screen) => (
                <Card key={screen.id}>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={screen.thumbnail || "/placeholder.svg"}
                        alt={screen.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={screen.issues > 3 ? "destructive" : screen.issues > 1 ? "warning" : "success"}
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {screen.issues} issues
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{screen.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Uploaded on {screen.uploadedAt}</p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Analyzed
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
                          <span>{report.date}</span>
                          <span className="mx-1">•</span>
                          <span>{report.screens} screens</span>
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
                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FileUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Settings screen uploaded</p>
                      <p className="text-sm text-gray-500">April 19, 2025 at 2:30 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Analysis completed for User Profile screen</p>
                      <p className="text-sm text-gray-500">April 18, 2025 at 4:15 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FileUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">User Profile screen uploaded</p>
                      <p className="text-sm text-gray-500">April 18, 2025 at 10:45 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Initial UX Audit report generated</p>
                      <p className="text-sm text-gray-500">April 17, 2025 at 3:20 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Project created</p>
                      <p className="text-sm text-gray-500">April 15, 2025 at 9:00 AM</p>
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
