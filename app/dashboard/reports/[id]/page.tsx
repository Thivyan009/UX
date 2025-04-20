import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Share2, AlertCircle, CheckCircle, Info, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the report data based on the ID
  const report = {
    id: params.id,
    name: "E-commerce Dashboard",
    date: "April 15, 2025",
    screens: 5,
    issues: {
      critical: 3,
      moderate: 6,
      minor: 3,
    },
    score: 78,
    screens: [
      { id: "screen-1", name: "Homepage", issues: 4, thumbnail: "/placeholder.svg?height=200&width=300&text=Homepage" },
      {
        id: "screen-2",
        name: "Product Page",
        issues: 3,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Product",
      },
      { id: "screen-3", name: "Checkout", issues: 5, thumbnail: "/placeholder.svg?height=200&width=300&text=Checkout" },
      {
        id: "screen-4",
        name: "User Profile",
        issues: 2,
        thumbnail: "/placeholder.svg?height=200&width=300&text=Profile",
      },
      { id: "screen-5", name: "Settings", issues: 1, thumbnail: "/placeholder.svg?height=200&width=300&text=Settings" },
    ],
    findings: [
      {
        id: "finding-1",
        severity: "critical",
        title: "Low contrast text on product pages",
        description:
          "Text on product pages has insufficient contrast ratio (2.8:1), making it difficult to read for users with visual impairments.",
        recommendation:
          "Increase the contrast ratio to at least 4.5:1 for normal text and 3:1 for large text to meet WCAG AA standards.",
      },
      {
        id: "finding-2",
        severity: "moderate",
        title: "Inconsistent button styling",
        description:
          "Buttons across the interface use inconsistent styling, colors, and sizes, creating confusion for users.",
        recommendation:
          "Standardize button styles based on their actions. Use consistent colors, sizes, and padding for primary, secondary, and tertiary actions.",
      },
      {
        id: "finding-3",
        severity: "critical",
        title: "Form validation errors not clearly visible",
        description:
          "Error messages on forms appear below fields without clear visual indicators, making them easy to miss.",
        recommendation:
          "Add clear visual indicators (red outlines, icons) and ensure error messages are prominently displayed next to the relevant fields.",
      },
    ],
  }

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/reports">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{report.name}</h1>
              <p className="text-gray-500">Report generated on {report.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">UX Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{report.score}/100</div>
                <div className="text-sm">
                  <Badge variant={report.score >= 80 ? "success" : report.score >= 60 ? "warning" : "destructive"}>
                    {report.score >= 80 ? "Good" : report.score >= 60 ? "Needs Improvement" : "Poor"}
                  </Badge>
                </div>
              </div>
              <Progress value={report.score} className="h-2 mt-4" />
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
                <span className="font-bold">{report.issues.critical}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Moderate</span>
                </div>
                <span className="font-bold">{report.issues.moderate}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Minor</span>
                </div>
                <span className="font-bold">{report.issues.minor}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Screens Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{report.screens.length}</div>
              <div className="flex -space-x-4 mt-2">
                {report.screens.slice(0, 5).map((screen, index) => (
                  <div
                    key={screen.id}
                    className="w-10 h-10 rounded-md border border-white overflow-hidden"
                    style={{ zIndex: 5 - index }}
                  >
                    <img
                      src={screen.thumbnail || "/placeholder.svg"}
                      alt={screen.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="findings">
          <TabsList>
            <TabsTrigger value="findings">Key Findings</TabsTrigger>
            <TabsTrigger value="screens">Screens</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="mt-6 space-y-6">
            {report.findings.map((finding) => (
              <Card key={finding.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {finding.severity === "critical" ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : finding.severity === "moderate" ? (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{finding.title}</h3>
                          <Badge
                            variant={
                              finding.severity === "critical"
                                ? "destructive"
                                : finding.severity === "moderate"
                                  ? "warning"
                                  : "default"
                            }
                            className="mt-1"
                          >
                            {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Issue</h4>
                        <p className="mt-1">{finding.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Recommendation</h4>
                        <p className="mt-1">{finding.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="screens" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.screens.map((screen) => (
                <Card key={screen.id}>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={screen.thumbnail || "/placeholder.svg"}
                        alt={screen.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {screen.issues} issues
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{screen.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>UX Improvement Recommendations</CardTitle>
                <CardDescription>Prioritized recommendations to improve your user experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Fix Critical Accessibility Issues First</h3>
                      <p className="text-gray-600 mt-1">
                        Address the contrast issues and form validation errors as top priority to ensure your interface
                        is usable by all users, including those with visual impairments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Standardize UI Components</h3>
                      <p className="text-gray-600 mt-1">
                        Create a consistent design system for buttons, form elements, and other UI components to improve
                        usability and reduce cognitive load for users.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Improve Navigation Structure</h3>
                      <p className="text-gray-600 mt-1">
                        Simplify the navigation structure to make it more intuitive and reduce the number of steps
                        required to complete common tasks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Positive Aspects to Maintain</h3>
                      <p className="text-gray-600 mt-1">
                        Your product layout and information hierarchy are well-designed. Maintain these strengths while
                        addressing the issues identified.
                      </p>
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
