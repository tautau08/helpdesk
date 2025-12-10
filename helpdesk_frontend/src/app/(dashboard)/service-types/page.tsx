"use client";

import { useState, useEffect } from "react";
import { serviceTypeService } from "@/lib/api/service-type.service";
import type { ServiceType } from "@/types/common.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function ServiceTypesPage() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("name-asc");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingServiceType, setDeletingServiceType] = useState<ServiceType | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    filterAndSortServiceTypes();
  }, [serviceTypes, searchQuery, filterStatus, sortBy]);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await serviceTypeService.getAll();
      setServiceTypes(response.content);
    } catch (error: any) {
      toast.error(error.message || "Failed to load service types");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServiceTypes = () => {
    let filtered = [...serviceTypes];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(serviceType =>
        serviceType.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(serviceType => 
        filterStatus === "active" ? serviceType.isActive : !serviceType.isActive
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

    setFilteredServiceTypes(filtered);
  };

  const handleCreateServiceType = () => {
    setEditingServiceType(null);
    setFormData({
      name: "",
      sortOrder: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditServiceType = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      sortOrder: serviceType.sortOrder,
      isActive: serviceType.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Service type name is required");
      return;
    }

    try {
      if (editingServiceType) {
        await serviceTypeService.update(editingServiceType.id, formData);
        toast.success("Service type updated successfully");
      } else {
        await serviceTypeService.create(formData);
        toast.success("Service type created successfully");
      }
      
      setShowCreateModal(false);
      fetchServiceTypes();
    } catch (error: any) {
      toast.error(error.message || "Failed to save service type");
    }
  };

  const handleToggleActive = async (serviceType: ServiceType) => {
    try {
      if (serviceType.isActive) {
        await serviceTypeService.deactivate(serviceType.id);
        toast.success("Service type deactivated");
      } else {
        await serviceTypeService.activate(serviceType.id);
        toast.success("Service type activated");
      }
      fetchServiceTypes();
    } catch (error: any) {
      toast.error(error.message || "Failed to update service type status");
    }
  };

  const handleDeleteClick = (serviceType: ServiceType) => {
    setDeletingServiceType(serviceType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingServiceType) return;

    try {
      await serviceTypeService.delete(deletingServiceType.id);
      toast.success("Service type deleted successfully");
      setShowDeleteModal(false);
      setDeletingServiceType(null);
      fetchServiceTypes();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service type");
    }
  };

  const totalServiceTypes = serviceTypes.length;
  const activeServiceTypes = serviceTypes.filter(s => s.isActive).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Types</h1>
        <p className="text-gray-600 mt-2">Manage ticket service types (Incident, Request, etc.)</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-600 font-medium">Total Service Types</p>
              <p className="text-3xl font-bold text-cyan-900 mt-2">{totalServiceTypes}</p>
            </div>
            <Package className="w-12 h-12 text-cyan-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Service Types</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeServiceTypes}</p>
            </div>
            <Package className="w-12 h-12 text-green-500 opacity-50" />
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
                placeholder="Search service types..."
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
            <Button onClick={handleCreateServiceType}>
              <Plus className="w-4 h-4 mr-2" />
              Create Service Type
            </Button>
          </div>
        </div>
      </div>

      {/* Service Type Cards Grid */}
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
      ) : filteredServiceTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No service types found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first service type"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateServiceType}>
              <Plus className="w-4 h-4 mr-2" />
              Create Service Type
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServiceTypes.map((serviceType) => (
            <div
              key={serviceType.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {serviceType.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        serviceType.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {serviceType.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Package className="w-10 h-10 text-primary opacity-20" />
                </div>

                {/* Service Type Details */}
                <div className="space-y-3 mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50">
                  {/* ID */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">{serviceType.id}</span>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="font-medium text-gray-900">{serviceType.sortOrder}</span>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {serviceType.createdTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-700">
                          {new Date(serviceType.createdTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {serviceType.createdUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created By:</span>
                        <span className="text-gray-700">User #{serviceType.createdUserId}</span>
                      </div>
                    )}
                    {serviceType.updatedTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated:</span>
                        <span className="text-gray-700">
                          {new Date(serviceType.updatedTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {serviceType.updatedByUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated By:</span>
                        <span className="text-gray-700">User #{serviceType.updatedByUserId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditServiceType(serviceType)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(serviceType)}
                    className="flex-1"
                  >
                    {serviceType.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(serviceType)}
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
                {editingServiceType ? "Edit Service Type" : "Create New Service Type"}
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
                  <Label htmlFor="name">Service Type Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter service type name (e.g., Incident, Request)"
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
                  {editingServiceType ? "Update Service Type" : "Create Service Type"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingServiceType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Service Type</h2>
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
                You are about to delete <strong>{deletingServiceType.name}</strong>.
                This will permanently remove the service type and may affect related tickets.
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
                Delete Service Type
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
