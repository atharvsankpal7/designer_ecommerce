"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Info, 
  Upload, 
  Link as LinkIcon, 
  Eye, 
  ArrowUpDown, 
  Settings,
  CheckCircle
} from "lucide-react"

interface SetupGuideProps {
  onClose: () => void
}

export function HeroSlideSetupGuide({ onClose }: SetupGuideProps) {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Hero Slides Setup Guide</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-900 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Image Requirements
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Format:</strong> PNG, JPG, GIF, WebP</li>
              <li>• <strong>Size:</strong> Maximum 10MB</li>
              <li>• <strong>Dimensions:</strong> 1920x600px recommended</li>
              <li>• <strong>Aspect Ratio:</strong> 16:5 for best results</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-blue-900 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Best Practices
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use high-quality, relevant images</li>
              <li>• Keep text overlay areas in mind</li>
              <li>• Optimize images for web performance</li>
              <li>• Test on mobile devices</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 pt-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Management Features
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Upload className="h-3 w-3" />
              <span>Upload/URL</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <ArrowUpDown className="h-3 w-3" />
              <span>Reorder</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Eye className="h-3 w-3" />
              <span>Toggle Active</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <LinkIcon className="h-3 w-3" />
              <span>Add Links</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Quick Start:</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            1. Click "Add New Slide" → 2. Upload image or enter URL → 3. Add title and description → 4. Save!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}