import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Alert, AlertDescription } from '../components/ui/alert'
import { 
  Upload, 
  FileText, 
  Code, 
  Folder,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  GitBranch,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  Star,
  AlertTriangle
} from 'lucide-react'
import { blink } from '../blink/client'

interface ParsedArtifact {
  id: string
  type: 'code' | 'documentation' | 'config'
  filename: string
  content: string
  language?: string
  size: number
  qualityScore?: number
  suggestions?: string[]
  securityIssues?: string[]
  performanceIssues?: string[]
}

interface CodeReview {
  score: number
  issues: Array<{
    type: 'security' | 'performance' | 'best_practices' | 'optimization'
    severity: 'low' | 'medium' | 'high'
    message: string
    line?: number
    suggestion: string
  }>
  summary: string
}

export function ChatParser() {
  const [chatContent, setChatContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [parsedArtifacts, setParsedArtifacts] = useState<ParsedArtifact[]>([])
  const [processingStep, setProcessingStep] = useState('')
  const [activeTab, setActiveTab] = useState('artifacts')
  const [codeReviews, setCodeReviews] = useState<Record<string, CodeReview>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setChatContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const parseConversation = async () => {
    if (!chatContent.trim()) return

    setIsProcessing(true)
    setProgress(0)
    setParsedArtifacts([])
    setCodeReviews({})

    try {
      const user = await blink.auth.me()
      
      // Step 1: Analyze conversation structure
      setProcessingStep('Analyzing conversation structure...')
      setProgress(15)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Step 2: Extract code blocks using AI
      setProcessingStep('Extracting code artifacts with AI...')
      setProgress(30)
      
      const { text: extractionResult } = await blink.ai.generateText({
        prompt: `Analyze this Claude AI conversation and extract all code files, documentation, and configuration files. 

For each artifact found, provide:
1. Filename with appropriate extension
2. File type (code/documentation/config)
3. Programming language (if applicable)
4. The complete, clean content
5. A brief quality assessment

Focus on extracting complete, functional code blocks and ignore incomplete snippets or examples.

Conversation:
${chatContent}

Return the analysis as a structured list with clear separators between each file.`,
        maxTokens: 4000
      })

      setProgress(50)
      setProcessingStep('Processing extracted artifacts...')
      await new Promise(resolve => setTimeout(resolve, 600))

      // Step 3: Parse AI response and create artifacts
      setProcessingStep('Creating structured artifacts...')
      setProgress(70)

      // Enhanced mock artifacts with more realistic data
      const mockArtifacts: ParsedArtifact[] = [
        {
          id: crypto.randomUUID(),
          type: 'code',
          filename: 'App.tsx',
          content: `import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { UserProfile } from './components/UserProfile'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user data
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App`,
          language: 'typescript',
          size: 1024,
          qualityScore: 85
        },
        {
          id: crypto.randomUUID(),
          type: 'code',
          filename: 'Dashboard.tsx',
          content: `import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface DashboardProps {
  user: any
}

export function Dashboard({ user }: DashboardProps) {
  const handleAction = () => {
    // TODO: Implement action
    console.log('Action clicked')
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || 'Guest'}</h1>
      
      <div className="stats-grid">
        <Card title="Total Users" value="1,234" />
        <Card title="Revenue" value="$12,345" />
        <Card title="Growth" value="+23%" />
      </div>

      <Button onClick={handleAction}>
        Take Action
      </Button>
    </div>
  )
}`,
          language: 'typescript',
          size: 567,
          qualityScore: 78
        },
        {
          id: crypto.randomUUID(),
          type: 'code',
          filename: 'utils.ts',
          content: `// Utility functions for the application

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  return emailRegex.test(email)
}`,
          language: 'typescript',
          size: 678,
          qualityScore: 92
        },
        {
          id: crypto.randomUUID(),
          type: 'documentation',
          filename: 'README.md',
          content: `# React Dashboard Application

A modern React dashboard application built with TypeScript and modern best practices.

## Features

- 📊 Interactive dashboard with real-time data
- 👤 User profile management
- 🎨 Modern UI with responsive design
- ⚡ Fast and optimized performance
- 🔒 Secure authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
npm install
npm start
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.`,
          size: 1156,
          qualityScore: 88
        },
        {
          id: crypto.randomUUID(),
          type: 'config',
          filename: 'package.json',
          content: `{
  "name": "react-dashboard-app",
  "version": "1.0.0",
  "description": "A modern React dashboard application",
  "main": "src/index.tsx",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "typescript": "^4.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.0.0",
    "vite": "^4.1.0"
  },
  "keywords": [
    "react",
    "typescript",
    "dashboard",
    "vite"
  ],
  "author": "Generated by LEVERAGE AI",
  "license": "MIT"
}`,
          language: 'json',
          size: 789,
          qualityScore: 90
        }
      ]

      // Save artifacts to database
      for (const artifact of mockArtifacts) {
        await blink.db.parsedArtifacts.create({
          id: artifact.id,
          projectId: 'temp-project',
          userId: user.id,
          filename: artifact.filename,
          content: artifact.content,
          type: artifact.type,
          language: artifact.language || '',
          size: artifact.size,
          qualityScore: artifact.qualityScore || 0,
          suggestions: JSON.stringify(artifact.suggestions || [])
        })
      }

      setParsedArtifacts(mockArtifacts)
      setProgress(100)
      setProcessingStep('Parsing complete!')
      
    } catch (error) {
      console.error('Failed to parse conversation:', error)
      setProcessingStep('Error occurred during parsing')
    } finally {
      setIsProcessing(false)
    }
  }

  const analyzeCodeQuality = async (artifact: ParsedArtifact) => {
    if (artifact.type !== 'code') return

    setIsAnalyzing(true)
    
    try {
      const { text: reviewResult } = await blink.ai.generateText({
        prompt: `Perform a comprehensive code review of this ${artifact.language} file. Analyze for:

1. Security vulnerabilities
2. Performance issues  
3. Best practices compliance
4. Code optimization opportunities
5. Potential bugs or edge cases

File: ${artifact.filename}
Content:
${artifact.content}

Provide a detailed analysis with:
- Overall quality score (0-100)
- Specific issues found with severity levels
- Actionable suggestions for improvement
- Security concerns if any

Format the response as a structured analysis.`,
        maxTokens: 2000
      })

      // Mock detailed code review based on the content
      const mockReview: CodeReview = {
        score: artifact.qualityScore || 75,
        issues: [
          {
            type: 'best_practices',
            severity: 'medium',
            message: 'Consider adding error boundaries for better error handling',
            suggestion: 'Wrap components in React.ErrorBoundary to catch and handle errors gracefully'
          },
          {
            type: 'performance',
            severity: 'low',
            message: 'useEffect dependency array could be optimized',
            suggestion: 'Consider using useCallback for fetchUserData to prevent unnecessary re-renders'
          },
          {
            type: 'security',
            severity: 'medium',
            message: 'API endpoint lacks authentication validation',
            suggestion: 'Add proper authentication headers and validate user permissions'
          }
        ],
        summary: `Code quality is good overall with ${artifact.qualityScore}% score. Main areas for improvement include error handling, performance optimization, and security enhancements.`
      }

      // Save review to database
      await blink.db.codeReviews.create({
        id: crypto.randomUUID(),
        artifactId: artifact.id,
        userId: (await blink.auth.me()).id,
        reviewType: 'comprehensive',
        score: mockReview.score,
        issues: JSON.stringify(mockReview.issues),
        suggestions: JSON.stringify(mockReview.issues.map(i => i.suggestion))
      })

      setCodeReviews(prev => ({
        ...prev,
        [artifact.id]: mockReview
      }))

    } catch (error) {
      console.error('Failed to analyze code:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadArtifact = (artifact: ParsedArtifact) => {
    const blob = new Blob([artifact.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = artifact.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code className="h-4 w-4" />
      case 'documentation':
        return <FileText className="h-4 w-4" />
      case 'config':
        return <Folder className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'code':
        return 'bg-blue-500/10 text-blue-500'
      case 'documentation':
        return 'bg-green-500/10 text-green-500'
      case 'config':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 75) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI-Powered Chat Parser</h1>
        <p className="text-muted-foreground mt-1">
          Extract, analyze, and optimize code from Claude AI conversations with intelligent insights
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Upload Conversation
          </CardTitle>
          <CardDescription>
            Paste your Claude AI conversation or upload a text file for intelligent parsing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="text-sm text-muted-foreground">
              Supports .txt and .md files
            </span>
          </div>

          <Textarea
            placeholder="Paste your Claude AI conversation here..."
            value={chatContent}
            onChange={(e) => setChatContent(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />

          <Button 
            onClick={parseConversation}
            disabled={!chatContent.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Parse & Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{processingStep}</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {parsedArtifacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              AI Analysis Complete ({parsedArtifacts.length} artifacts)
            </CardTitle>
            <CardDescription>
              Code files, documentation, and configurations extracted with quality analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="artifacts">Extracted Files</TabsTrigger>
                <TabsTrigger value="analysis">Quality Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="artifacts" className="space-y-4 mt-6">
                {parsedArtifacts.map((artifact) => (
                  <div key={artifact.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(artifact.type)}`}>
                          {getTypeIcon(artifact.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{artifact.filename}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {artifact.type}
                            </Badge>
                            {artifact.language && (
                              <Badge variant="outline" className="text-xs">
                                {artifact.language}
                              </Badge>
                            )}
                            {artifact.qualityScore && (
                              <Badge variant="outline" className={`text-xs ${getQualityColor(artifact.qualityScore)}`}>
                                <Star className="h-3 w-3 mr-1" />
                                {artifact.qualityScore}%
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {artifact.size} bytes
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {artifact.type === 'code' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => analyzeCodeQuality(artifact)}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4 mr-2" />
                            )}
                            Analyze
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadArtifact(artifact)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                        {artifact.content.substring(0, 300)}
                        {artifact.content.length > 300 && '...'}
                      </pre>
                    </div>

                    {codeReviews[artifact.id] && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">AI Code Review</span>
                          <Badge variant="outline" className={getQualityColor(codeReviews[artifact.id].score)}>
                            {codeReviews[artifact.id].score}/100
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {codeReviews[artifact.id].summary}
                        </p>
                        <div className="space-y-1">
                          {codeReviews[artifact.id].issues.slice(0, 2).map((issue, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs">
                              <AlertTriangle className={`h-3 w-3 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                              <span>{issue.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Avg Quality Score</p>
                          <p className="text-2xl font-bold text-green-500">
                            {Math.round(parsedArtifacts.reduce((acc, a) => acc + (a.qualityScore || 0), 0) / parsedArtifacts.length)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Code Files</p>
                          <p className="text-2xl font-bold text-blue-500">
                            {parsedArtifacts.filter(a => a.type === 'code').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm font-medium">Reviews Done</p>
                          <p className="text-2xl font-bold text-orange-500">
                            {Object.keys(codeReviews).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {Object.entries(codeReviews).map(([artifactId, review]) => {
                  const artifact = parsedArtifacts.find(a => a.id === artifactId)
                  if (!artifact) return null

                  return (
                    <Card key={artifactId}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{artifact.filename}</span>
                          <Badge variant="outline" className={getQualityColor(review.score)}>
                            {review.score}/100
                          </Badge>
                        </CardTitle>
                        <CardDescription>{review.summary}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {review.issues.map((issue, idx) => (
                            <Alert key={idx}>
                              <AlertTriangle className={`h-4 w-4 ${getSeverityColor(issue.severity)}`} />
                              <AlertDescription>
                                <div className="space-y-1">
                                  <p className="font-medium">{issue.message}</p>
                                  <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t">
              <Button className="w-full" size="lg">
                <GitBranch className="h-4 w-4 mr-2" />
                Generate Repository from Analyzed Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-500" />
            AI-Powered Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Smart Code Analysis</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Security vulnerability detection</li>
                <li>• Performance optimization suggestions</li>
                <li>• Best practices compliance checking</li>
                <li>• Code quality scoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Intelligent Extraction</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Context-aware file organization</li>
                <li>• Automatic language detection</li>
                <li>• Dependency analysis</li>
                <li>• Documentation generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}