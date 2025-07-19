import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { 
  Search, 
  Github, 
  Calendar, 
  ExternalLink,
  Download,
  Trash2,
  Filter
} from 'lucide-react'

interface HistoryItem {
  id: string
  name: string
  description: string
  framework: string
  status: 'completed' | 'failed' | 'processing'
  createdAt: string
  githubUrl?: string
  downloadUrl?: string
  filesCount: number
}

export function History() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Load history data
    loadHistory()
  }, [])

  const loadHistory = async () => {
    // Mock data - in real app, this would fetch from database
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        name: 'react-dashboard-app',
        description: 'A modern React dashboard with charts and analytics',
        framework: 'React + TypeScript',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        githubUrl: 'https://github.com/user/react-dashboard-app',
        downloadUrl: '#',
        filesCount: 24
      },
      {
        id: '2',
        name: 'nextjs-blog',
        description: 'A blog built with Next.js and MDX',
        framework: 'Next.js',
        status: 'completed',
        createdAt: '2024-01-14T15:45:00Z',
        githubUrl: 'https://github.com/user/nextjs-blog',
        downloadUrl: '#',
        filesCount: 18
      },
      {
        id: '3',
        name: 'vue-ecommerce',
        description: 'E-commerce platform with Vue.js',
        framework: 'Vue.js',
        status: 'processing',
        createdAt: '2024-01-14T09:20:00Z',
        filesCount: 0
      },
      {
        id: '4',
        name: 'python-api',
        description: 'REST API with FastAPI and PostgreSQL',
        framework: 'Python',
        status: 'failed',
        createdAt: '2024-01-13T14:15:00Z',
        filesCount: 8
      },
      {
        id: '5',
        name: 'svelte-portfolio',
        description: 'Personal portfolio website',
        framework: 'SvelteKit',
        status: 'completed',
        createdAt: '2024-01-12T11:00:00Z',
        githubUrl: 'https://github.com/user/svelte-portfolio',
        downloadUrl: '#',
        filesCount: 12
      }
    ]
    setHistoryItems(mockHistory)
  }

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500'
      case 'processing':
        return 'bg-blue-500/10 text-blue-500'
      case 'failed':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const deleteItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Export History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your generated repositories and exports
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.framework}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{item.filesCount} files</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.status === 'completed' && item.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View on GitHub
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  
                  {item.status === 'completed' && item.downloadUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by parsing a conversation to create your first repository'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button>
                  Create Your First Project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {historyItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Your export statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{historyItems.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {historyItems.filter(item => item.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {historyItems.filter(item => item.status === 'processing').length}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {historyItems.reduce((sum, item) => sum + item.filesCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}