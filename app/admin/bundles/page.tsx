"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload, Expand, Package } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface Bundle {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountPrice?: number;
  displayImage: string;
  isActive: boolean;
  isFeatured: boolean;
  products: Product[];
}

interface Product {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
}

export default function AdminBundles() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingBundles, setIsLoadingBundles] = useState(true); // New loading state for bundles
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // New loading state for products
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    displayImage: "",
    products: [] as string[],
    isActive: true,
    isFeatured: false,
  });
  const [uploading, setUploading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchBundles();
    fetchProducts();
  }, []);

  const fetchBundles = async () => {
    setIsLoadingBundles(true); // Set loading to true before fetching
    try {
      const response = await fetch("/api/bundles");
      const data = await response.json();
      setBundles(data);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast.error("Failed to load bundles.");
    } finally {
      setIsLoadingBundles(false); // Set loading to false after fetching
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true); // Set loading to true before fetching
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products for selection.");
    } finally {
      setIsLoadingProducts(false); // Set loading to false after fetching
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "kwf4nlm7"); // Replace with your actual upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();
      setFormData((prev) => ({ ...prev, displayImage: data.secure_url }));
      toast.success("Display image uploaded successfully");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Failed to upload display image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.products.length === 0) {
      toast.error("Please select at least one product for the bundle");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : undefined,
        displayImage: formData.displayImage,
        products: formData.products, // These are product IDs
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      const url = editingBundle
        ? `/api/bundles/${editingBundle.id}`
        : "/api/bundles";
      const method = editingBundle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingBundle ? "Bundle updated" : "Bundle created");
        setIsModalOpen(false);
        resetForm();
        fetchBundles(); // Re-fetch bundles to update the list
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error(`Failed to save bundle: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      description: bundle.description,
      originalPrice: bundle.originalPrice.toString(),
      discountPrice: bundle.discountPrice?.toString() || "",
      displayImage: bundle.displayImage,
      products: bundle.products.map(p => p.id),
      isActive: bundle.isActive,
      isFeatured: bundle.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const response = await fetch(`/api/bundles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Bundle deleted");
        fetchBundles(); // Re-fetch bundles to update the list
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete bundle: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      displayImage: "",
      products: [],
      isActive: true,
      isFeatured: false,
    });
    setEditingBundle(null);
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      products: checked
        ? [...prev.products, productId]
        : prev.products.filter(id => id !== productId)
    }));
  };

  const SkeletonCard = () => (
    <Card className="flex flex-col h-full animate-pulse">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="relative aspect-square mb-4 bg-gray-200 rounded-lg" />
        <div className="flex-grow">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex items-center mb-4">
            <Skeleton className="h-4 w-4 mr-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex space-x-2 mt-auto">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-9 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );

  const ProductSelectionSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
      {[...Array(6)].map((_, i) => ( // Show 6 skeleton items
        <div key={i} className="flex items-center space-x-2 p-2 border rounded">
          <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox skeleton */}
          <div className="flex-1 min-w-0 flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded" /> {/* Image skeleton */}
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4" /> {/* Title skeleton */}
              <Skeleton className="h-3 w-1/2 mt-1" /> {/* Price skeleton */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bundle Management</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBundle ? "Edit Bundle" : "Add New Bundle"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Bundle Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountPrice">Discount Price (₹) - Optional</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="displayImage">Display Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayImage"
                        value={formData.displayImage}
                        onChange={(e) => setFormData({ ...formData, displayImage: e.target.value })}
                        placeholder="Enter image URL or upload"
                        required
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <Button type="button" variant="outline" disabled={uploading}>
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>Select Products for Bundle</Label>
                  {isLoadingProducts ? (
                    <ProductSelectionSkeleton />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                      {products.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No products available. Add some products first!</p>
                      ) : (
                        products.map((product) => (
                          <div key={product.id} className="flex items-center space-x-2 p-2 border rounded">
                            <Checkbox
                              id={product.id}
                              checked={formData.products.includes(product.id)}
                              onCheckedChange={(checked) =>
                                handleProductSelection(product.id, checked as boolean)
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={product.displayImage}
                                  alt={product.title}
                                  width={40}
                                  height={40}
                                  className="object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{product.title}</p>
                                  <p className="text-xs text-gray-500">
                                    ₹{product.discountPrice || product.originalPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {formData.products.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.products.length} product(s) selected
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="featured">Featured on Homepage</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={uploading || isLoadingProducts}>
                  {uploading ? "Uploading..." : editingBundle ? "Update Bundle" : "Create Bundle"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingBundles ? (
            // Render 6 skeleton cards while bundles are loading
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : bundles.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">
                No bundles found. Create your first bundle!
              </p>
            </div>
          ) : (
            bundles.map((bundle) => (
              <Card key={bundle.id} className="flex flex-col h-full">
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="relative aspect-square mb-4 group overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={bundle.displayImage}
                      alt={bundle.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 space-x-1">
                      {bundle.isFeatured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {!bundle.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedImage(bundle.displayImage)}
                      className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Expand className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {bundle.description}
                    </p>
                    <div className="flex items-center mb-2">
                      <Package className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {bundle.products.length} product(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {bundle.discountPrice && (
                        <span className="text-lg font-bold text-primary">
                          ₹{bundle.discountPrice}
                        </span>
                      )}
                      <span
                        className={`${
                          bundle.discountPrice
                            ? "line-through text-gray-500 ml-2"
                            : "text-lg font-bold"
                        }`}
                      >
                        ₹{bundle.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(bundle)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(bundle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Image Expansion Modal */}
      <Dialog
        open={!!expandedImage}
        onOpenChange={(open) => !open && setExpandedImage(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
          {expandedImage && (
            <div className="relative w-full h-full">
              <Image
                src={expandedImage}
                alt="Expanded bundle view"
                width={800} // Adjust based on your common image sizes
                height={600} // Adjust based on your common image sizes
                className="object-contain w-full h-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}