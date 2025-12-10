"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTicketSchema, CreateTicketFormData } from "@/lib/schemas/ticket.schema";
import { ticketService } from "@/lib/api/ticket.service";
import { companyService } from "@/lib/api/company.service";
import { categoryService } from "@/lib/api/category.service";
import { subcategoryService } from "@/lib/api/subcategory.service";
import { statusService } from "@/lib/api/status.service";
import { priorityService } from "@/lib/api/priority.service";
import { serviceTypeService } from "@/lib/api/service-type.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import type { Company, Category, Subcategory, Status, Priority, ServiceType } from "@/types/common.types";

export default function CreateTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Dropdown options
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  
  // Loading states
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
  });

  const selectedCategoryId = watch("categoryId");
  const selectedSubcategoryId = watch("subcategoryId");

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch categories when company changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
      setValue("subcategoryId", 0 as any);
    }
  }, [selectedCategoryId, setValue]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const fetchInitialData = async () => {
    try {
      setLoadingCompanies(true);
      const [companiesRes, statusesRes, prioritiesRes, serviceTypesRes, categoriesRes] = await Promise.all([
        companyService.getAll({ size: 100 }),
        statusService.getAll({ size: 100 }),
        priorityService.getAll({ size: 100 }),
        serviceTypeService.getAll({ size: 100 }),
        categoryService.getAll({ size: 100 }),
      ]);
      
      setCompanies(companiesRes.content.filter((c) => c.isActive));
      setStatuses(statusesRes.content.filter((s) => s.isActive));
      setPriorities(prioritiesRes.content.filter((p) => p.isActive));
      setServiceTypes(serviceTypesRes.content.filter((st) => st.isActive));
      setCategories(categoriesRes.content.filter((c) => c.isActive));
    } catch (error) {
      toast.error("Failed to load form data");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      setLoadingSubcategories(true);
      const response = await subcategoryService.getAll({ 
        categoryId, 
        size: 100 
      });
      setSubcategories(response.content.filter((sc) => sc.isActive));
    } catch (error) {
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (5MB max per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Add new files to existing ones
    const newFiles = [...uploadedImages, ...files];
    setUploadedImages(newFiles);

    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    toast.success(`${files.length} image(s) added`);
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      setIsLoading(true);
      const ticketData = {
        ...data,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      };
      await ticketService.create(ticketData);
      toast.success("Ticket created successfully!");
      
      // Cleanup preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      router.push("/tickets");
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected subcategory for SLA display
  const selectedSubcategory = subcategories.find(
    (sc) => sc.id === selectedSubcategoryId
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/tickets" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Ticket</h1>
        <p className="text-gray-600 mt-2">Submit a new support request</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-card p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Brief description of the issue"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Detailed description of the issue..."
                rows={4}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments (Optional)</h2>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (MAX. 5MB each)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={preview}
                          alt={`Upload preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadedImages[index]?.name.substring(0, 20)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {imagePreviews.length > 0 && (
                <p className="text-sm text-gray-600">
                  {imagePreviews.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Categorization */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="companyId">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={loadingCompanies || isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.companyId && (
                  <p className="text-sm text-red-500">{errors.companyId.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label htmlFor="subcategoryId">
                  Subcategory <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="subcategoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={!selectedCategoryId || loadingSubcategories || isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subcategoryId && (
                  <p className="text-sm text-red-500">{errors.subcategoryId.message}</p>
                )}
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceTypeId">
                  Service Type <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="serviceTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serviceTypeId && (
                  <p className="text-sm text-red-500">{errors.serviceTypeId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Classification */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Classification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priorityId">
                  Priority <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="priorityId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.id} value={priority.id.toString()}>
                            {priority.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priorityId && (
                  <p className="text-sm text-red-500">{errors.priorityId.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="statusId">
                  Initial Status <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="statusId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id.toString()}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.statusId && (
                  <p className="text-sm text-red-500">{errors.statusId.message}</p>
                )}
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  placeholder="0"
                  disabled={isLoading}
                  defaultValue={0}
                />
                <p className="text-xs text-gray-500">Display order (lower numbers appear first)</p>
                {errors.sortOrder && (
                  <p className="text-sm text-red-500">{errors.sortOrder.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* SLA Information */}
          {selectedSubcategory && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">SLA Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {selectedSubcategory.responseTime && (
                  <div>
                    <p className="text-blue-700 font-medium">Expected Response Time</p>
                    <p className="text-blue-900">{selectedSubcategory.responseTime} minutes</p>
                  </div>
                )}
                {selectedSubcategory.resolutionTime && (
                  <div>
                    <p className="text-blue-700 font-medium">Expected Resolution Time</p>
                    <p className="text-blue-900">{selectedSubcategory.resolutionTime} minutes</p>
                  </div>
                )}
                <div>
                  <p className="text-blue-700 font-medium">Customer Response Required</p>
                  <p className="text-blue-900">
                    {selectedSubcategory.isCustomerResponseRequired ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Link href="/tickets">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
