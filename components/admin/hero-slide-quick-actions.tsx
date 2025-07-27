"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

interface QuickActionsProps {
  onRefresh: () => void
  slidesCount: number
}

export function HeroSlideQuickActions({ onRefresh, slidesCount }: QuickActionsProps) {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleSeedSlides = async () => {
    if (slidesCount > 0) {
      const confirmed = window.confirm(
        "This will add sample hero slides. Existing slides will not be affected. Continue?"
      )
      if (!confirmed) return
    }

    setIsSeeding(true)
    try {
      const response = await fetch("/api/admin/hero-slides/seed", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to seed hero slides")
      }

      const result = await response.json()
      toast.success(`${result.count} sample hero slides added!`)
      onRefresh()
    } catch (error) {
      console.error("Error seeding hero slides:", error)
      toast.error("Failed to seed hero slides")
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearCache = async () => {
    try {
      const response = await fetch("/api/revalidate/hero-slides", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to clear cache")
      }

      toast.success("Hero slides cache cleared!")
    } catch (error) {
      console.error("Error clearing cache:", error)
      toast.error("Failed to clear cache")
    }
  }

  return (
    <Card className="border-gray-200 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Database className="h-5 w-5 mr-2 text-teal-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Current Slides</p>
            <p className="text-xs text-gray-500">Active hero slides</p>
          </div>
          <Badge variant="outline" className="text-teal-600 border-teal-200">
            {slidesCount} slides
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedSlides}
            disabled={isSeeding}
            className="flex items-center justify-center"
          >
            {isSeeding ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            {isSeeding ? "Adding..." : "Add Samples"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleClearCache}
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear Cache
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>

        {slidesCount === 0 && (
          <div className="flex items-center space-x-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-700">
              No slides found. Add samples or create your first slide.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}