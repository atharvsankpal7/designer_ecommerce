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
import { Plus, Edit, Trash2, Upload, Expand } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
  section: {
    [x: string]: string;
    name: string;
  };
}

interface Section {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    sectionId: "",
    displayImage: "",
    productFiles: [] as string[],
    isFeatured: false,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchSections();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/sections");
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

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
    } catch (error) {
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
        sectionId: formData.sectionId,
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
        toast.error("Failed to save product");
      }
    } catch (error) {
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
      sectionId: product.section.id || "",
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
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      originalPrice: "",
      discountPrice: "",
      sectionId: "",
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
          <h1 className="text-3xl font-bold">Product Management</h1>
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
                {/* ... (keep all the existing form fields the same) ... */}
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
                  <p className="text-sm text-gray-500 mb-2">
                    Section: {product.section.name}
                  </p>
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
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found. Please Check Later
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
  );
}