"use client";

import { useState, useEffect } from "react";
import { departmentService } from "@/lib/api/department.service";
import type { Department } from "@/types/common.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("name-asc");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterAndSortDepartments();
  }, [departments, searchQuery, filterStatus, sortBy]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAll();
      setDepartments(response.content);
    } catch (error: any) {
      toast.error(error.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDepartments = () => {
    let filtered = [...departments];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(department =>
        department.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(department => 
        filterStatus === "active" ? department.isActive : !department.isActive
      );
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

    setFilteredDepartments(filtered);
  };

  const handleCreateDepartment = () => {
    setEditingDepartment(null);
    setFormData({
      name: "",
      sortOrder: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      sortOrder: department.sortOrder,
      isActive: department.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, formData);
        toast.success("Department updated successfully");
      } else {
        await departmentService.create(formData);
        toast.success("Department created successfully");
      }
      
      setShowCreateModal(false);
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || "Failed to save department");
    }
  };

  const handleToggleActive = async (department: Department) => {
    try {
      if (department.isActive) {
        await departmentService.deactivate(department.id);
        toast.success("Department deactivated");
      } else {
        await departmentService.activate(department.id);
        toast.success("Department activated");
      }
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || "Failed to update department status");
    }
  };

  const handleDeleteClick = (department: Department) => {
    setDeletingDepartment(department);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDepartment) return;

    try {
      await departmentService.delete(deletingDepartment.id);
      toast.success("Department deleted successfully");
      setShowDeleteModal(false);
      setDeletingDepartment(null);
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete department");
    }
  };

  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.isActive).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-600 mt-2">Manage organizational departments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-medium">Total Departments</p>
              <p className="text-3xl font-bold text-teal-900 mt-2">{totalDepartments}</p>
            </div>
            <Users className="w-12 h-12 text-teal-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Departments</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeDepartments}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-50" />
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
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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
            <Button onClick={handleCreateDepartment}>
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </Button>
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
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
      ) : filteredDepartments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first department"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateDepartment}>
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {department.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        department.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {department.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Users className="w-10 h-10 text-primary opacity-20" />
                </div>

                {/* Department Details */}
                <div className="space-y-3 mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50">
                  {/* ID */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">{department.id}</span>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="font-medium text-gray-900">{department.sortOrder}</span>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {department.createdTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-700">
                          {new Date(department.createdTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {department.createdUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created By:</span>
                        <span className="text-gray-700">User #{department.createdUserId}</span>
                      </div>
                    )}
                    {department.updatedTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated:</span>
                        <span className="text-gray-700">
                          {new Date(department.updatedTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {department.updatedByUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated By:</span>
                        <span className="text-gray-700">User #{department.updatedByUserId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDepartment(department)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(department)}
                    className="flex-1"
                  >
                    {department.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(department)}
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
                {editingDepartment ? "Edit Department" : "Create New Department"}
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
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter department name (e.g., IT Support, HR, Finance)"
                    maxLength={150}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.name.length}/150 characters
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
                  {editingDepartment ? "Update Department" : "Create Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Department</h2>
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
                You are about to delete <strong>{deletingDepartment.name}</strong>.
                This will permanently remove the department and may affect related users.
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
                Delete Department
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
