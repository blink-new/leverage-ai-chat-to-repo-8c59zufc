import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Badge } from '../components/ui/badge'
import { 
  GitBranch, 
  Github, 
  Settings, 
  Folder,
  FileText,
  Code,
  Rocket,
  CheckCircle
} from 'lucide-react'

export function RepositoryGenerator() {
  const [repoConfig, setRepoConfig] = useState({
    name: '',
    description: '',
    framework: '',
    includeCI: true,
    includeDocker: false,
    includeDocs: true,
    license: 'MIT'
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const frameworks = [
    { value: 'react', label: 'React + TypeScript' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'SvelteKit' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
  ]

  const licenses = [
    { value: 'MIT', label: 'MIT License' },
    { value: 'Apache-2.0', label: 'Apache 2.0' },
    { value: 'GPL-3.0', label: 'GPL 3.0' },
    { value: 'BSD-3-Clause', label: 'BSD 3-Clause' },
  ]

  const generateRepository = async () => {
    setIsGenerating(true)
    
    // Simulate repository generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsGenerating(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Repository Generator</h1>
        <p className="text-muted-foreground mt-1">
          Create production-ready GitHub repositories with CI/CD and deployment scripts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repository Configuration</CardTitle>
              <CardDescription>
                Set up your repository details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository Name</Label>
                <Input
                  id="repo-name"
                  placeholder="my-awesome-project"
                  value={repoConfig.name}
                  onChange={(e) => setRepoConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo-description">Description</Label>
                <Input
                  id="repo-description"
                  placeholder="A brief description of your project"
                  value={repoConfig.description}
                  onChange={(e) => setRepoConfig(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Framework/Technology</Label>
                <Select value={repoConfig.framework} onValueChange={(value) => setRepoConfig(prev => ({ ...prev, framework: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map((framework) => (
                      <SelectItem key={framework.value} value={framework.value}>
                        {framework.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>License</Label>
                <Select value={repoConfig.license} onValueChange={(value) => setRepoConfig(prev => ({ ...prev, license: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {licenses.map((license) => (
                      <SelectItem key={license.value} value={license.value}>
                        {license.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Features</CardTitle>
              <CardDescription>
                Choose what to include in your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-ci"
                  checked={repoConfig.includeCI}
                  onCheckedChange={(checked) => setRepoConfig(prev => ({ ...prev, includeCI: checked as boolean }))}
                />
                <Label htmlFor="include-ci">CI/CD Pipeline (GitHub Actions)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-docker"
                  checked={repoConfig.includeDocker}
                  onCheckedChange={(checked) => setRepoConfig(prev => ({ ...prev, includeDocker: checked as boolean }))}
                />
                <Label htmlFor="include-docker">Docker Configuration</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-docs"
                  checked={repoConfig.includeDocs}
                  onCheckedChange={(checked) => setRepoConfig(prev => ({ ...prev, includeDocs: checked as boolean }))}
                />
                <Label htmlFor="include-docs">Documentation Templates</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repository Preview</CardTitle>
              <CardDescription>
                Preview of your generated repository structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="font-mono">{repoConfig.name || 'project-name'}/</span>
                </div>
                
                <div className="ml-6 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="font-mono">README.md</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-orange-500" />
                    <span className="font-mono">package.json</span>
                  </div>
                  
                  {repoConfig.framework === 'react' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-blue-500" />
                        <span className="font-mono">src/</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-blue-400" />
                          <span className="font-mono">App.tsx</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-blue-400" />
                          <span className="font-mono">index.tsx</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {repoConfig.includeCI && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-blue-500" />
                        <span className="font-mono">.github/</span>
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-purple-500" />
                          <span className="font-mono">workflows/ci.yml</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {repoConfig.includeDocker && (
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      <span className="font-mono">Dockerfile</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-mono">LICENSE</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Project structure optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dependency management</span>
                </div>
                {repoConfig.includeCI && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automated testing & deployment</span>
                  </div>
                )}
                {repoConfig.includeDocker && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Containerization ready</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Production-ready configuration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={generateRepository}
            disabled={!repoConfig.name || !repoConfig.framework || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                Generating Repository...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Generate & Deploy to GitHub
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}