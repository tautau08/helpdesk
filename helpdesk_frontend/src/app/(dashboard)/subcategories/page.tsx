"use client";

import { useState, useEffect } from "react";
import { subcategoryService } from "@/lib/api/subcategory.service";
import { categoryService } from "@/lib/api/category.service";
import type { Subcategory, Category } from "@/types/common.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tags, Plus, Search, Edit, Trash2, Tag, Clock, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterCategory, setFilterCategory] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("name-asc");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSubcategory, setDeletingSubcategory] = useState<Subcategory | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: 0,
    responseTime: undefined as number | undefined,
    resolutionTime: undefined as number | undefined,
    isCustomerResponseRequired: false,
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortSubcategories();
  }, [subcategories, searchQuery, filterStatus, filterCategory, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subcategoriesResponse, categoriesResponse] = await Promise.all([
        subcategoryService.getAll(),
        categoryService.getAll()
      ]);
      
      setSubcategories(subcategoriesResponse.content);
      setCategories(categoriesResponse.content);
    } catch (error: any) {
      toast.error(error.message || "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSubcategories = () => {
    let filtered = [...subcategories];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(subcategory =>
        subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(subcategory => 
        filterStatus === "active" ? subcategory.isActive : !subcategory.isActive
      );
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(subcategory => subcategory.categoryId === filterCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime();
        case "oldest":
          return new Date(a.createdTime || 0).getTime() - new Date(b.createdTime || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredSubcategories(filtered);
  };

  const handleCreateSubcategory = () => {
    setEditingSubcategory(null);
    setFormData({
      name: "",
      categoryId: 0,
      responseTime: undefined,
      resolutionTime: undefined,
      isCustomerResponseRequired: false,
      sortOrder: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      responseTime: subcategory.responseTime,
      resolutionTime: subcategory.resolutionTime,
      isCustomerResponseRequired: subcategory.isCustomerResponseRequired || false,
      sortOrder: subcategory.sortOrder,
      isActive: subcategory.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      toast.error("Category is required");
      return;
    }

    try {
      if (editingSubcategory) {
        await subcategoryService.update(editingSubcategory.id, formData);
        toast.success("Subcategory updated successfully");
      } else {
        await subcategoryService.create(formData);
        toast.success("Subcategory created successfully");
      }
      
      setShowCreateModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save subcategory");
    }
  };

  const handleToggleActive = async (subcategory: Subcategory) => {
    try {
      if (subcategory.isActive) {
        await subcategoryService.deactivate(subcategory.id);
        toast.success("Subcategory deactivated");
      } else {
        await subcategoryService.activate(subcategory.id);
        toast.success("Subcategory activated");
      }
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update subcategory status");
    }
  };

  const handleDeleteClick = (subcategory: Subcategory) => {
    setDeletingSubcategory(subcategory);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubcategory) return;

    try {
      await subcategoryService.delete(deletingSubcategory.id);
      toast.success("Subcategory deleted successfully");
      setShowDeleteModal(false);
      setDeletingSubcategory(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete subcategory");
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const totalSubcategories = subcategories.length;
  const activeSubcategories = subcategories.filter(s => s.isActive).length;
  const withSLA = subcategories.filter(s => s.responseTime || s.resolutionTime).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
        <p className="text-gray-600 mt-2">Manage subcategories with SLA configurations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-600 font-medium">Total Subcategories</p>
              <p className="text-3xl font-bold text-pink-900 mt-2">{totalSubcategories}</p>
            </div>
            <Tags className="w-12 h-12 text-pink-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Subcategories</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeSubcategories}</p>
            </div>
            <Tags className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">With SLA Configured</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{withSLA}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search subcategories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Create Button */}
            <Button onClick={handleCreateSubcategory}>
              <Plus className="w-4 h-4 mr-2" />
              Create Subcategory
            </Button>
          </div>
        </div>
      </div>

      {/* Subcategory Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredSubcategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <Tags className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subcategories found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first subcategory"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateSubcategory}>
              <Plus className="w-4 h-4 mr-2" />
              Create Subcategory
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {subcategory.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subcategory.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subcategory.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Tags className="w-10 h-10 text-primary opacity-20" />
                </div>

                {/* Subcategory Details */}
                <div className="space-y-3 mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50">
                  {/* ID */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">{subcategory.id}</span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {getCategoryName(subcategory.categoryId)}
                    </span>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="font-medium text-gray-900">{subcategory.sortOrder}</span>
                  </div>

                  {/* SLA Information */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Response Time:
                      </span>
                      <span className="font-medium text-gray-900">
                        {subcategory.responseTime ? `${subcategory.responseTime} min` : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Resolution Time:
                      </span>
                      <span className="font-medium text-gray-900">
                        {subcategory.resolutionTime ? `${subcategory.resolutionTime} min` : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Customer Response:
                      </span>
                      <span className={`font-medium ${subcategory.isCustomerResponseRequired ? 'text-amber-600' : 'text-gray-600'}`}>
                        {subcategory.isCustomerResponseRequired ? "Required" : "Not Required"}
                      </span>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {subcategory.createdTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-700">
                          {new Date(subcategory.createdTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {subcategory.createdUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created By:</span>
                        <span className="text-gray-700">User #{subcategory.createdUserId}</span>
                      </div>
                    )}
                    {subcategory.updatedTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated:</span>
                        <span className="text-gray-700">
                          {new Date(subcategory.updatedTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {subcategory.updatedByUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated By:</span>
                        <span className="text-gray-700">User #{subcategory.updatedByUserId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSubcategory(subcategory)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(subcategory)}
                    className="flex-1"
                  >
                    {subcategory.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(subcategory)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSubcategory ? "Edit Subcategory" : "Create New Subcategory"}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Subcategory Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter subcategory name"
                    maxLength={150}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.name.length}/150 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value={0}>Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Required: This subcategory belongs to which category
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responseTime">Response Time (min)</Label>
                    <Input
                      id="responseTime"
                      type="number"
                      value={formData.responseTime || ""}
                      onChange={(e) => setFormData({ ...formData, responseTime: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="30"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="resolutionTime">Resolution Time (min)</Label>
                    <Input
                      id="resolutionTime"
                      type="number"
                      value={formData.resolutionTime || ""}
                      onChange={(e) => setFormData({ ...formData, resolutionTime: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="120"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCustomerResponseRequired"
                    checked={formData.isCustomerResponseRequired}
                    onChange={(e) => setFormData({ ...formData, isCustomerResponseRequired: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="isCustomerResponseRequired" className="cursor-pointer">
                    Customer Response Required
                  </Label>
                </div>

                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Controls display order (lower numbers appear first)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    Active Status
                  </Label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSubcategory ? "Update Subcategory" : "Create Subcategory"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingSubcategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Subcategory</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700">
                You are about to delete <strong>{deletingSubcategory.name}</strong>.
                This will permanently remove the subcategory and may affect related tickets and escalation matrices.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Subcategory
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
