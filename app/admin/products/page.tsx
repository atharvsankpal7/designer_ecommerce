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
import { Plus, Edit, Trash2, Upload, Expand, ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { HierarchicalSectionSelector } from "@/components/admin/hierarchical-section-selector";

interface ProductSection {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice?: number;
  displayImage: string;
  productFiles: string[];
  isFeatured: boolean;
  isActive: boolean;
  sections: ProductSection[];
}

const ProductSkeleton = () => (
              <Card className="flex flex-col h-full">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="relative aspect-square mb-4 group overflow-hidden rounded-lg bg-gray-100">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="flex-grow">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
                    <div className="mb-2">
          <Skeleton className="h-3 w-16 mb-1" />
                      <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-1/4" />
                    </div>
                  <div className="flex space-x-2 mt-auto">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="h-9 w-1/4" />
                  </div>
                </CardContent>
              </Card>
  );

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    sectionIds: [] as string[],
    displayImage: "",
    productFiles: [] as string[],
    isFeatured: false,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error : any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.");
}  };



  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kwf4nlm7");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setFormData((prev) => ({ ...prev, displayImage: data.secure_url }));
      toast.success("Display image uploaded successfully");
    } catch (error : any) {
      toast.error("Failed to upload display image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddFileUrl = () => {
    if (newFileUrl.trim() && !formData.productFiles.includes(newFileUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        productFiles: [...prev.productFiles, newFileUrl.trim()],
      }));
      setNewFileUrl("");
      toast.success("URL added to product files");
    } else if (!newFileUrl.trim()) {
      toast.error("Please enter a valid URL");
    } else {
      toast.error("This URL is already added");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one section is selected
    if (formData.sectionIds.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    const validProductFiles = formData.productFiles.filter(
      (file) => file && file.trim() !== ""
    );

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : undefined,
        sectionIds: formData.sectionIds,
        displayImage: formData.displayImage,
        productFiles: validProductFiles,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated" : "Product created");
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast.error("Failed to save product: " + (errorData.message || "Unknown error"));
      }
    } catch (error : any) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      originalPrice: product.originalPrice.toString(),
      discountPrice: product.discountPrice?.toString() || "",
      sectionIds: product.sections?.map(section => section.id) || [],
      displayImage: product.displayImage,
      productFiles: product.productFiles || [],
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted");
        fetchProducts(); // Re-fetch products to update the list
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error : any) {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      sectionIds: [],
      displayImage: "",
      productFiles: [],
      isFeatured: false,
      isActive: true,
    });
    setNewFileUrl("");
    setEditingProduct(null);
  };

  const removeProductFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productFiles: prev.productFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex">
              <Link href="/admin">
                <ArrowLeftIcon />
                Panel
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Product Management</h1>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalPrice: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountPrice">
                      Discount Price (Optional)
                    </Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Sections</Label>
                  <HierarchicalSectionSelector
                    selectedSectionIds={formData.sectionIds}
                    onSelectionChange={(sectionIds) =>
                      setFormData({ ...formData, sectionIds })
                    }
                  />
                </div>

                <div>
                  <Label>Display Image</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="mb-2"
                    />
                    {formData.displayImage && (
                      <div className="relative w-32 h-32">
                        <Image
                          src={formData.displayImage}
                          alt="Display preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Product Files (URLs)</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter file URL (e.g., https://example.com/file.pdf)"
                        value={newFileUrl}
                        onChange={(e) => setNewFileUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddFileUrl}
                        variant="outline"
                      >
                        Add URL
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.productFiles
                        .filter(Boolean) // Filter out null/undefined values
                        .map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-100 rounded"
                          >
                            <span className="text-sm truncate">
                              {file}
                            </span>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeProductFile(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFeatured: checked })
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading
                    ? "Uploading..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full">
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="relative aspect-square mb-4 group overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.displayImage}
                      alt={product.title}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 left-2 space-x-1">
                      {product.isFeatured && (
                        <Badge className="bg-yellow-500">Featured</Badge>
                      )}
                      {!product.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedImage(product.displayImage)}
                      className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Expand className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sections && product.sections.length > 0 ? (
                          product.sections.slice(0, 3).map((section) => (
                            <Badge key={section.id} variant="outline" className="text-xs">
                              {section.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No sections
                          </Badge>
                        )}
                        {product.sections && product.sections.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.sections.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.discountPrice && (
                        <span className="text-lg font-bold text-primary">
                          ₹{product.discountPrice}
                        </span>
                      )}
                      <span
                        className={`${
                          product.discountPrice
                            ? "line-through text-gray-500 ml-2"
                            : "text-lg font-bold"
                        }`}
                      >
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">
                No products found. Please add a new product.
              </p>
            </div>
          )}
        </div>

        {/* Image Expansion Modal */}
        <Dialog
          open={!!expandedImage}
          onOpenChange={(open) => !open && setExpandedImage(null)}
        >
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none container">
            {expandedImage && (
              <div className="relative w-full h-full">
                <Image
                  src={expandedImage}
                  alt="Expanded product view"
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
