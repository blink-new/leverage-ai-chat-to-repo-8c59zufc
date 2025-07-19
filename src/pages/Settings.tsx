import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { 
  Github, 
  Key, 
  Bell, 
  Shield,
  Save,
  ExternalLink
} from 'lucide-react'

export function Settings() {
  const [settings, setSettings] = useState({
    githubToken: '',
    githubUsername: '',
    defaultLicense: 'MIT',
    autoCommit: true,
    notifications: true,
    privateRepos: false,
    aiModel: 'gpt-4'
  })

  const [isSaving, setIsSaving] = useState(false)

  const saveSettings = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your preferences and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Github className="h-5 w-5 mr-2" />
              GitHub Integration
            </CardTitle>
            <CardDescription>
              Connect your GitHub account to create repositories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-username">GitHub Username</Label>
              <Input
                id="github-username"
                placeholder="your-username"
                value={settings.githubUsername}
                onChange={(e) => setSettings(prev => ({ ...prev, githubUsername: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-token">Personal Access Token</Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={settings.githubToken}
                onChange={(e) => setSettings(prev => ({ ...prev, githubToken: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Generate a token on GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Create Private Repositories</Label>
                <p className="text-sm text-muted-foreground">
                  Make generated repositories private by default
                </p>
              </div>
              <Switch
                checked={settings.privateRepos}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, privateRepos: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Configure AI parsing and generation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>AI Model</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={settings.aiModel}
                onChange={(e) => setSettings(prev => ({ ...prev, aiModel: e.target.value }))}
              >
                <option value="gpt-4">GPT-4 (Recommended)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-commit Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically commit generated files
                </p>
              </div>
              <Switch
                checked={settings.autoCommit}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCommit: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when repositories are created
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notification Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Repository created</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Parsing completed</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deployment status</span>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage your security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                Conversation data is automatically deleted after 30 days
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">API Keys</h4>
              <p className="text-sm text-muted-foreground">
                All API keys are encrypted and stored securely
              </p>
            </div>

            <Button variant="outline" className="w-full">
              Export My Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-pulse" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}