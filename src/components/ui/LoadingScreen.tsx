import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading LEVERAGE AI...</p>
      </div>
    </div>
  )
}