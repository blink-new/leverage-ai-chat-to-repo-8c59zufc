import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Clock, 
  GitBranch, 
  Github,
  ExternalLink,
  Search,
  Filter,
  Download,
  Trash2,
  Star,
  TrendingUp,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Copy
} from 'lucide-react'
import { blink } from '../blink/client'

interface Project {
  id: string
  name: string
  description: string
  framework: string
  status: string
  createdAt: string
  updatedAt: string
  githubRepoUrl?: string
  deploymentUrl?: string
}

interface ExportRecord {
  id: string
  projectId: string
  projectName: string
  exportType: string
  status: string
  resultUrl?: string
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

interface AnalyticsData {
  totalProjects: number
  successfulExports: number
  totalExports: number
  avgGenerationTime: number
  popularFrameworks: Array<{ framework: string; count: number }>
  recentActivity: Array<{ date: string; projects: number; exports: number }>
}

export function History() {
  const [projects, setProjects] = useState<Project[]>([])
  const [exports, setExports] = useState<ExportRecord[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [frameworkFilter, setFrameworkFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('projects')

  const loadData = useCallback(async () => {
    try {
      const user = await blink.auth.me()
      
      // Load projects
      const projectData = await blink.db.projects.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      setProjects(projectData)

      // Load export history
      const exportData = await blink.db.exportHistory.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 100
      })
      setExports(exportData)

      // Generate analytics
      const analyticsData = generateAnalytics(projectData, exportData)
      setAnalytics(analyticsData)

    } catch (error) {
      console.error('Failed to load history data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const generateAnalytics = (projects: Project[], exports: ExportRecord[]): AnalyticsData => {
    const successfulExports = exports.filter(e => e.status === 'completed').length
    
    // Count frameworks
    const frameworkCounts = projects.reduce((acc, project) => {
      acc[project.framework] = (acc[project.framework] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const popularFrameworks = Object.entries(frameworkCounts)
      .map(([framework, count]) => ({ framework, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Generate recent activity (last 7 days)
    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayProjects = projects.filter(p => 
        p.createdAt.startsWith(dateStr)
      ).length
      
      const dayExports = exports.filter(e => 
        e.createdAt.startsWith(dateStr)
      ).length

      return {
        date: dateStr,
        projects: dayProjects,
        exports: dayExports
      }
    }).reverse()

    return {
      totalProjects: projects.length,
      successfulExports,
      totalExports: exports.length,
      avgGenerationTime: 45, // Mock average in seconds
      popularFrameworks,
      recentActivity
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesFramework = frameworkFilter === 'all' || project.framework === frameworkFilter
    
    return matchesSearch && matchesStatus && matchesFramework
  })

  const filteredExports = exports.filter(exportRecord => {
    const matchesSearch = exportRecord.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exportRecord.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500'
      case 'failed':
        return 'bg-red-500/10 text-red-500'
      case 'processing':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const deleteProject = async (projectId: string) => {
    try {
      await blink.db.projects.delete(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Project History & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your generated repositories, exports, and development insights
        </p>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold text-blue-500">{analytics.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Successful Exports</p>
                  <p className="text-2xl font-bold text-green-500">{analytics.successfulExports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {analytics.totalExports > 0 ? Math.round((analytics.successfulExports / analytics.totalExports) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Avg Generation Time</p>
                  <p className="text-2xl font-bold text-orange-500">{analytics.avgGenerationTime}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="exports">Export History ({exports.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {activeTab === 'projects' && (
            <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="nextjs">Next.js</SelectItem>
                <SelectItem value="vue">Vue.js</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="projects" className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || frameworkFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Start by creating your first project'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium">{project.name}</h3>
                          <Badge variant="outline">{project.framework}</Badge>
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{project.status}</span>
                          </Badge>
                        </div>
                        
                        {project.description && (
                          <p className="text-muted-foreground mb-3">{project.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {project.githubRepoUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        
                        {project.deploymentUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          {filteredExports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No exports found</h3>
                <p className="text-muted-foreground">
                  Export history will appear here once you start generating repositories
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredExports.map((exportRecord) => (
                <Card key={exportRecord.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{exportRecord.projectName}</h3>
                          <Badge variant="outline">{exportRecord.exportType}</Badge>
                          <Badge className={getStatusColor(exportRecord.status)}>
                            {getStatusIcon(exportRecord.status)}
                            <span className="ml-1">{exportRecord.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Started {new Date(exportRecord.createdAt).toLocaleDateString()}</span>
                          </div>
                          {exportRecord.completedAt && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed {new Date(exportRecord.completedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {exportRecord.errorMessage && (
                          <p className="text-sm text-red-500 mt-2">{exportRecord.errorMessage}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {exportRecord.resultUrl && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(exportRecord.resultUrl!)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={exportRecord.resultUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Popular Frameworks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Popular Frameworks
                  </CardTitle>
                  <CardDescription>
                    Most used frameworks in your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popularFrameworks.map((item, index) => (
                      <div key={item.framework} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium capitalize">{item.framework}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(item.count / analytics.totalProjects) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Recent Activity (Last 7 Days)
                  </CardTitle>
                  <CardDescription>
                    Daily project creation and export activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.recentActivity.map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>{day.projects} projects</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>{day.exports} exports</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🚀 Productivity Tip
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        You've generated {analytics.totalProjects} projects! Consider creating custom templates 
                        for your most common project types to speed up future generations.
                      </p>
                    </div>
                    
                    {analytics.successfulExports / analytics.totalExports < 0.9 && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                          ⚠️ Success Rate Alert
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Your export success rate is below 90%. Check your GitHub permissions and 
                          ensure all required fields are filled correctly.
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                        💡 Framework Insight
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {analytics.popularFrameworks[0]?.framework} is your most used framework. 
                        Explore our advanced {analytics.popularFrameworks[0]?.framework} templates 
                        for even better results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}