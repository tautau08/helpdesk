"use client";

import { useState, useEffect } from "react";
import { companyService } from "@/lib/api/company.service";
import { projectService } from "@/lib/api/project.service";
import type { Company, Project } from "@/types/common.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Search, Edit, Trash2, Users, FolderOpen, TrendingUp, X } from "lucide-react";
import { toast } from "sonner";

interface CompanyWithStats extends Company {
  projectCount?: number;
  userCount?: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("name-asc");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterAndSortCompanies();
  }, [companies, searchQuery, filterStatus, sortBy]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getAll();
      
      const companiesWithStats = await Promise.all(
        response.content.map(async (company) => {
          try {
            const projectCount = await companyService.getProjectCount(company.id);
            return {
              ...company,
              projectCount,
              userCount: 0 // Will be updated when user API is available
            };
          } catch (error) {
            return {
              ...company,
              projectCount: 0,
              userCount: 0
            };
          }
        })
      );
      
      setCompanies(companiesWithStats);
    } catch (error: any) {
      toast.error(error.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCompanies = () => {
    let filtered = [...companies];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(company => 
        filterStatus === "active" ? company.isActive : !company.isActive
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

    setFilteredCompanies(filtered);
  };

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      sortOrder: 0,
      isActive: true
    });
    setShowCreateModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      sortOrder: company.sortOrder,
      isActive: company.isActive
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      if (editingCompany) {
        await companyService.update(editingCompany.id, formData);
        toast.success("Company updated successfully");
      } else {
        await companyService.create(formData);
        toast.success("Company created successfully");
      }
      
      setShowCreateModal(false);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to save company");
    }
  };

  const handleToggleActive = async (company: Company) => {
    try {
      if (company.isActive) {
        await companyService.deactivate(company.id);
        toast.success("Company deactivated");
      } else {
        await companyService.activate(company.id);
        toast.success("Company activated");
      }
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to update company status");
    }
  };

  const handleDeleteClick = (company: Company) => {
    setDeletingCompany(company);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCompany) return;

    try {
      await companyService.delete(deletingCompany.id);
      toast.success("Company deleted successfully");
      setShowDeleteModal(false);
      setDeletingCompany(null);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete company");
    }
  };

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.isActive).length;
  const totalProjects = companies.reduce((sum, c) => sum + (c.projectCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
     
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Companies</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalCompanies}</p>
            </div>
            <Building2 className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Companies</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{activeCompanies}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{totalProjects}</p>
            </div>
            <FolderOpen className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search companies..."
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
          <Button onClick={handleCreateCompany}>
            <Plus className="w-4 h-4 mr-2" />
            Create Company
          </Button>
        </div>
      </div>

      {/* Company Cards Grid */}
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
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first company"}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateCompany}>
              <Plus className="w-4 h-4 mr-2" />
              Create Company
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300  overflow-hidden"
            >
              <div className="p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {company.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {company.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Building2 className="w-10 h-10 text-primary opacity-20" />
                </div>

                {/* Company Details */}
                <div className="space-y-3 mb-4">
                  {/* ID */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-gray-900">{company.id}</span>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sort Order:</span>
                    <span className="font-medium text-gray-900">{company.sortOrder}</span>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Projects</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {company.projectCount || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Users</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {company.userCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {company.createdTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created:</span>
                        <span className="text-gray-700">
                          {new Date(company.createdTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {company.createdUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Created By:</span>
                        <span className="text-gray-700">User #{company.createdUserId}</span>
                      </div>
                    )}
                    {company.updatedTime && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated:</span>
                        <span className="text-gray-700">
                          {new Date(company.updatedTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {company.updatedByUserId && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Updated By:</span>
                        <span className="text-gray-700">User #{company.updatedByUserId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCompany(company)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(company)}
                    className="flex-1"
                  >
                    {company.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(company)}
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
                {editingCompany ? "Edit Company" : "Create New Company"}
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
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter company name"
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
                  {editingCompany ? "Update Company" : "Create Company"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Company</h2>
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
                You are about to delete <strong>{deletingCompany.name}</strong>.
                This will permanently remove the company and may affect related projects and users.
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
                Delete Company
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
