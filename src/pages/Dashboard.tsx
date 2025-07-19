import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  MessageSquare, 
  GitBranch, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  Github,
  Zap
} from 'lucide-react'
import { blink } from '../blink/client'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalConversations: 0,
    successfulExports: 0,
    recentActivity: []
  })

  useEffect(() => {
    // Load dashboard stats
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // This would fetch real data from the database
      setStats({
        totalProjects: 12,
        totalConversations: 45,
        successfulExports: 38,
        recentActivity: [
          { id: 1, type: 'export', name: 'React Dashboard App', time: '2 hours ago' },
          { id: 2, type: 'parse', name: 'Claude Chat Analysis', time: '5 hours ago' },
          { id: 3, type: 'export', name: 'Next.js Blog', time: '1 day ago' },
        ]
      })
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Transform your AI conversations into production-ready repositories
          </p>
        </div>
        <Link to="/parser">
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations Parsed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              +12 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Exports</CardTitle>
            <Github className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulExports}</div>
            <p className="text-xs text-muted-foreground">
              84% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Gain</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Time saved vs manual setup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with common workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/parser">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Parse Claude Conversation
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/generator">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Generate Repository
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/history">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  View Export History
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest projects and exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant={activity.type === 'export' ? 'default' : 'secondary'}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>What You Can Do</CardTitle>
          <CardDescription>
            Leverage AI to automate your development workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Parse Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Extract code and documentation from Claude AI conversations with intelligent parsing
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <GitBranch className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Generate Repositories</h3>
              <p className="text-sm text-muted-foreground">
                Create production-ready GitHub repositories with proper structure and CI/CD
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold">One-Click Deploy</h3>
              <p className="text-sm text-muted-foreground">
                Deploy your projects instantly with automated deployment scripts and configurations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}