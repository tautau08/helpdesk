"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/lib/api/category.service";
import { projectService } from "@/lib/api/project.service";
import type { Category, Project } from "@/types/common.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Plus, Search, Edit, Trash2, FolderOpen, Layers, X } from "lucide-react";
import { toast } from "sonner";

interface CategoryWithStats extends Category {
  subcategoryCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithStats[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterProject, setFilterProject] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("name-asc");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    projectId: 0,
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchQuery, filterStatus, filterProject, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, projectsResponse] = await Promise.all([
        categoryService.getAll(),
        projectService.getAll()
      ]);
      
      // Fetch subcategory counts for each category
      const categoriesWithStats = await Promise.all(
        categoriesResponse.content.map(async (category) => {
          try {
            const subcategoryCount = await categoryService.getSubcategoryCount(category.id);
            return {
              ...category,
              subcategoryCount
            };
          } catch (error) {
            // If count fails, default to 0
            return {
              ...category,
              subcategoryCount: 0
            };
          }
        })
      );
      
      setCategories(categoriesWithStats);
      setProjects(projectsResponse.content);
    } catch (error: any) {
      toast.error(error.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    let filtered = [...categories];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(category => 
        filterStatus === "active" ? category.isActive : !category.isActive
      );
    }

    // Apply project filter
    if (filterProject !== "all") {
      filtered = filtered.filter(category => category.projectId === filterProject);
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

    setFilteredCategories(filtered);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      projectId: 0,
      sortOrder: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      projectId: category.projectId,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.projectId || formData.projectId === 0) {
      toast.error("Project is required");
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success("Category updated successfully");
      } else {
        await categoryService.create(formData);
        toast.success("Category created successfully");
      }
      
      setShowCreateModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      if (category.isActive) {
        await categoryService.deactivate(category.id);
        toast.success("Category deactivated");
      } else {
        await categoryService.activate(category.id);
        toast.success("Category activated");
      }
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category status");
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    try {
      await categoryService.delete(deletingCategory.id);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setDeletingCategory(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "Unknown";
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalSubcategories = categories.reduce((sum, c) => sum + (c.subcategoryCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-2">Manage issue categories and their subcategories</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Categories</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">{totalCategories}</p>
            </div>
            <Tag className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Categories</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeCategories}</p>
            </div>
            <Tag className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Subcategories</p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">{totalSubcategories}</p>
            </div>
            <Layers className="w-12 h-12 text-indigo-500 opacity-50" />
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
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Project */}
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
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
            <Button onClick={handleCreateCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
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
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first category"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300  overflow-hidden"
            >
              <div className="p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Tag className="w-10 h-10 text-primary opacity-20" />
                </div>

                {/* Category Details */}
                <div className="space-y-3 mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50">
                  {/* ID */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">{category.id}</span>
                  </div>

                  {/* Project */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {getProjectName(category.projectId)}
                    </span>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="font-medium text-gray-900">{category.sortOrder}</span>
                  </div>

                  {/* Statistics */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Subcategories</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {category.subcategoryCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {category.createdTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-700">
                          {new Date(category.createdTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {category.createdUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created By:</span>
                        <span className="text-gray-700">User #{category.createdUserId}</span>
                      </div>
                    )}
                    {category.updatedTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated:</span>
                        <span className="text-gray-700">
                          {new Date(category.updatedTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {category.updatedByUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated By:</span>
                        <span className="text-gray-700">User #{category.updatedByUserId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(category)}
                    className="flex-1"
                  >
                    {category.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
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
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    maxLength={150}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.name.length}/150 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="projectId">Project *</Label>
                  <select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value={0}>Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Required: This category belongs to which project
                  </p>
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
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Category</h2>
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
                You are about to delete <strong>{deletingCategory.name}</strong>.
                This will permanently remove the category and may affect related subcategories and tickets.
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
                Delete Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
