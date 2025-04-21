import { notFound } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, Info, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { getScreen } from "@/lib/actions/screens"

export default async function ScreenDetailPage({
  params,
}: {
  params: { id: string; screenId: string }
}) {
  const screen = await getScreen(params.screenId)

  if (!screen) {
    notFound()
  }

  // Group issues by severity
  const criticalIssues = screen.issues.filter((issue) => issue.severity === "CRITICAL")
  const moderateIssues = screen.issues.filter((issue) => issue.severity === "MODERATE")
  const minorIssues = screen.issues.filter((issue) => issue.severity === "MINOR")

  return (
    <DashboardLayout>
      <div className="container p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/projects/${params.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{screen.name}</h1>
              <p className="text-gray-500">{screen.description}</p>
            </div>
          </div>
          <div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {screen.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>UI Screen</CardTitle>
                <CardDescription>Uploaded on {new Date(screen.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md overflow-hidden border border-gray-200">
                  <img src={screen.imageUrl || "/placeholder.svg"} alt={screen.name} className="w-full h-auto" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline">{screen.type}</Badge>
                  <Badge variant="secondary">{screen.issues.length} issues found</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>UX Analysis Results</CardTitle>
                <CardDescription>AI-powered analysis of usability issues and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Critical Issues</span>
                  </div>
                  <span className="font-bold">{criticalIssues.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Moderate Issues</span>
                  </div>
                  <span className="font-bold">{moderateIssues.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Minor Issues</span>
                  </div>
                  <span className="font-bold">{minorIssues.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>Key findings from the UX audit</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our AI analysis identified {screen.issues.length} issues in your UI design.
                  {criticalIssues.length > 0 && ` ${criticalIssues.length} critical issues need immediate attention.`}
                  {moderateIssues.length > 0 && ` ${moderateIssues.length} moderate issues should be addressed soon.`}
                  {minorIssues.length > 0 && ` ${minorIssues.length} minor issues can improve the overall experience.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Detailed Findings</h2>

        {criticalIssues.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Critical Issues
            </h3>
            {criticalIssues.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{issue.title}</h3>
                          <Badge variant="destructive" className="mt-1">
                            Critical
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
                        <p className="mt-1">{issue.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Recommendation</h4>
                        <p className="mt-1">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {moderateIssues.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Moderate Issues
            </h3>
            {moderateIssues.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{issue.title}</h3>
                          <Badge variant="warning" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                            Moderate
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
                        <p className="mt-1">{issue.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Recommendation</h4>
                        <p className="mt-1">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {minorIssues.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Minor Issues
            </h3>
            {minorIssues.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{issue.title}</h3>
                          <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                            Minor
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
                        <p className="mt-1">{issue.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Recommendation</h4>
                        <p className="mt-1">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
