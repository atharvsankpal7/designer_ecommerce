"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { HeroSlidePreview } from "@/components/admin/hero-slide-preview"
import { ImageUpload } from "@/components/admin/image-upload"
import { HeroSlideSetupGuide } from "@/components/admin/hero-slide-setup-guide"

interface HeroSlide {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SlideFormData {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  linkUrl: string;
  linkText: string;
  isActive: boolean;
}

const initialFormData: SlideFormData = {
  title: "",
  description: "",
  imageUrl: "",
  altText: "",
  displayOrder: 0,
  linkUrl: "",
  linkText: "",
  isActive: true,
};

export default function HeroSlidesAdmin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState<SlideFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.isAdmin) {
      router.push("/admin/login")
      return
    }

    fetchSlides()
  }, [session, status, router])

  const fetchSlides = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/hero-slides")
      const data = await response.json()
      setSlides(data.slides || [])
    } catch (error) {
      console.error("Error fetching hero slides:", error)
      toast.error("Failed to fetch hero slides")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingSlide 
        ? `/api/admin/hero-slides/${editingSlide.id}`
        : "/api/admin/hero-slides"
      
      const method = editingSlide ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save hero slide")
      }

      toast.success(editingSlide ? "Hero slide updated!" : "Hero slide created!")
      setIsDialogOpen(false)
      setEditingSlide(null)
      setFormData(initialFormData)
      fetchSlides()
    } catch (error) {
      console.error("Error saving hero slide:", error)
      toast.error("Failed to save hero slide")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description || "",
      imageUrl: slide.imageUrl,
      altText: slide.altText,
      displayOrder: slide.displayOrder,
      linkUrl: slide.linkUrl || "",
      linkText: slide.linkText || "",
      isActive: slide.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete hero slide")
      }

      toast.success("Hero slide deleted!")
      fetchSlides()
    } catch (error) {
      console.error("Error deleting hero slide:", error)
      toast.error("Failed to delete hero slide")
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to toggle hero slide status")
      }

      toast.success("Hero slide status updated!")
      fetchSlides()
    } catch (error) {
      console.error("Error toggling hero slide status:", error)
      toast.error("Failed to update hero slide status")
    }
  }

  const handleReorder = async (slideId: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slideId)
    if (currentIndex === -1) return

    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (targetIndex < 0 || targetIndex >= newSlides.length) return

    // Swap slides
    [newSlides[currentIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentIndex]]
    
    // Update display orders
    const slideIds = newSlides.map(slide => slide.id)
    
    try {
      const response = await fetch("/api/admin/hero-slides/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slideIds }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder hero slides")
      }

      toast.success("Hero slides reordered!")
      fetchSlides()
    } catch (error) {
      console.error("Error reordering hero slides:", error)
      toast.error("Failed to reorder hero slides")
    }
  }

  const openCreateDialog = () => {
    setEditingSlide(null)
    setFormData({
      ...initialFormData,
      displayOrder: slides.length,
    })
    setIsDialogOpen(true)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100/40 via-teal-100/40 to-blue-100/40">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-pink-500 bg-clip-text text-transparent">
              Hero Slides Management
            </h1>
            <p className="text-teal-700 font-medium">Manage your homepage hero slider</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/admin">← Back to Dashboard</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {showSetupGuide ? "Hide Guide" : "Show Guide"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Slide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter slide title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayOrder">Display Order *</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter slide description (optional)"
                      rows={3}
                    />
                  </div>

                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => {
                      setFormData({ ...formData, imageUrl: url })
                      // Auto-generate alt text if it's empty and we have a title
                      if (!formData.altText && formData.title) {
                        const filename = url.split('/').pop()?.split('?')[0] || 'hero-slide'
                        const generatedAltText = `${formData.title} - Hero slide image`
                        setFormData(prev => ({ ...prev, altText: generatedAltText }))
                      }
                    }}
                    label="Hero Slide Image"
                    placeholder="Enter image URL or upload a file"
                    required
                    useApiEndpoint={true}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="altText">Alt Text *</Label>
                    <Input
                      id="altText"
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      placeholder="Enter image alt text for accessibility"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkUrl">Link URL (optional)</Label>
                      <Input
                        id="linkUrl"
                        value={formData.linkUrl}
                        onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                        placeholder="Enter link URL (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkText">Link Text (optional)</Label>
                      <Input
                        id="linkText"
                        value={formData.linkText}
                        onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                        placeholder="Enter link text (optional)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingSlide ? "Update" : "Create"}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Setup Guide */}
        {showSetupGuide && (
          <div className="mb-8">
            <HeroSlideSetupGuide onClose={() => setShowSetupGuide(false)} />
          </div>
        )}

        {/* Preview Section */}
        {slides.length > 0 && (
          <div className="mb-8">
            <HeroSlidePreview slides={slides} />
          </div>
        )}

        {/* Slides List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : slides.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hero slides found</h3>
                <p className="text-gray-600 mb-4">Create your first hero slide to get started.</p>
                <Button onClick={openCreateDialog} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Slide
                </Button>
              </CardContent>
            </Card>
          ) : (
            slides.map((slide, index) => (
              <Card key={slide.id} className="border border-gray-200 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Image Preview */}
                    <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                src={slide.imageUrl}
                alt={slide.altText}
                        width={128}
                        height={80}
                        className="w-full h-full object-contain"
                quality={90}
                      />
                    </div>

                    {/* Slide Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {slide.title}
                        </h3>
                        <Badge variant={slide.isActive ? "default" : "secondary"}>
                          {slide.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">Order: {slide.displayOrder}</Badge>
                      </div>
                      {slide.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {slide.description}
                        </p>
                      )}
                      {slide.linkUrl && (
                        <div className="flex items-center text-sm text-teal-600">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          <span className="truncate">{slide.linkText || slide.linkUrl}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {/* Reorder buttons */}
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(slide.id, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(slide.id, 'down')}
                          disabled={index === slides.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Toggle status */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(slide.id)}
                        className="h-8 w-8 p-0"
                      >
                        {slide.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slide)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{slide.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(slide.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}