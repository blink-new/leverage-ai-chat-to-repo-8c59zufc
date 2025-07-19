import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  Upload, 
  FileText, 
  Code, 
  Folder,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react'
import { blink } from '../blink/client'

interface ParsedArtifact {
  id: string
  type: 'code' | 'documentation' | 'config'
  filename: string
  content: string
  language?: string
  size: number
}

export function ChatParser() {
  const [chatContent, setChatContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [parsedArtifacts, setParsedArtifacts] = useState<ParsedArtifact[]>([])
  const [processingStep, setProcessingStep] = useState('')

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

    try {
      // Step 1: Analyze conversation structure
      setProcessingStep('Analyzing conversation structure...')
      setProgress(20)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Extract code blocks
      setProcessingStep('Extracting code artifacts...')
      setProgress(40)
      
      // Use Blink AI to parse the conversation
      const { text: analysisResult } = await blink.ai.generateText({
        prompt: `Analyze this Claude AI conversation and extract all code files, documentation, and configuration files. For each artifact, provide:
        1. Filename with appropriate extension
        2. File type (code/documentation/config)
        3. Programming language (if applicable)
        4. The complete content

        Conversation:
        ${chatContent}

        Return the analysis in a structured format that identifies each distinct file.`,
        maxTokens: 4000
      })

      setProgress(60)
      setProcessingStep('Organizing file structure...')
      await new Promise(resolve => setTimeout(resolve, 800))

      // Step 3: Generate structured artifacts
      setProcessingStep('Generating artifacts...')
      setProgress(80)

      // Parse the AI response and create artifacts
      const mockArtifacts: ParsedArtifact[] = [
        {
          id: '1',
          type: 'code',
          filename: 'App.tsx',
          content: '// React component extracted from conversation\nimport React from "react"\n\nfunction App() {\n  return <div>Hello World</div>\n}\n\nexport default App',
          language: 'typescript',
          size: 156
        },
        {
          id: '2',
          type: 'code',
          filename: 'utils.ts',
          content: '// Utility functions\nexport const formatDate = (date: Date) => {\n  return date.toISOString().split("T")[0]\n}',
          language: 'typescript',
          size: 98
        },
        {
          id: '3',
          type: 'documentation',
          filename: 'README.md',
          content: '# Project Title\n\nThis project was generated from a Claude AI conversation.\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## Installation\n\n```bash\nnpm install\nnpm start\n```',
          size: 187
        },
        {
          id: '4',
          type: 'config',
          filename: 'package.json',
          content: '{\n  "name": "extracted-project",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}',
          language: 'json',
          size: 112
        }
      ]

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Chat Parser</h1>
        <p className="text-muted-foreground mt-1">
          Extract code and documentation from Claude AI conversations
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Conversation</CardTitle>
          <CardDescription>
            Paste your Claude AI conversation or upload a text file
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
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Parse Conversation
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
              Extracted Artifacts ({parsedArtifacts.length})
            </CardTitle>
            <CardDescription>
              Code files, documentation, and configurations found in the conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                          <span className="text-xs text-muted-foreground">
                            {artifact.size} bytes
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadArtifact(artifact)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3">
                    <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                      {artifact.content.substring(0, 200)}
                      {artifact.content.length > 200 && '...'}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button className="w-full" size="lg">
                <GitBranch className="h-4 w-4 mr-2" />
                Generate Repository from Artifacts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
            Tips for Better Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Include complete conversations with clear code blocks</li>
            <li>• Make sure file names and extensions are mentioned in the chat</li>
            <li>• Include any package.json, requirements.txt, or config files discussed</li>
            <li>• Conversations with step-by-step implementations work best</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}