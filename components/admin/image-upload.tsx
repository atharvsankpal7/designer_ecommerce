"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { validateImageFile, validateImageUrl, formatFileSize } from "@/lib/image-utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  useApiEndpoint?: boolean // Option to use API endpoint instead of direct Cloudinary
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Image", 
  placeholder = "Enter image URL or upload a file",
  required = false,
  useApiEndpoint = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState(value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file using utility function
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid file")
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      let response;
      
      if (useApiEndpoint) {
        // Use our API endpoint
        response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        })
      } else {
        // Use direct Cloudinary upload
        formData.append("upload_preset", "kwf4nlm7") // You may need to create this preset in Cloudinary
        response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        )
      }

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Handle different response formats
      const imageUrl = useApiEndpoint ? data.url : data.secure_url
      
      onChange(imageUrl)
      setUrlInput(imageUrl)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = () => {
    const validation = validateImageUrl(urlInput)
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid URL")
      return
    }

    onChange(urlInput.trim())
    toast.success("Image URL added successfully!")
  }

  const handleClear = () => {
    onChange("")
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                    {selectedFile && (
                      <p className="text-xs text-gray-500">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </div>
                )}
              </div>
              
              {/* Selected file info */}
              {selectedFile && !uploading && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                >
                  Add URL
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Enter a direct link to an image (e.g., https://example.com/image.jpg)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Preview */}
      {value && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="relative w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => {
                    toast.error("Failed to load image. Please check the URL.")
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Current Image</p>
                <p className="text-xs text-gray-500 truncate">{value}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}