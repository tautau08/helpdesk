"use client";

import { useState, useEffect } from "react";
import { ticketService } from "@/lib/api/ticket.service";
import { Ticket } from "@/types/ticket.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, X, Edit, Trash2, Clock, User, Building2, Tag, Calendar, Eye, MoreVertical, Power } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string>("");

  useEffect(() => {
    fetchTickets();
  }, [currentPage, searchTerm]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getAll({
        name: searchTerm || undefined,
        page: currentPage,
        size: 10,
        sort: "createdTime,desc",
      });
      setTickets(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: "bg-blue-100 text-blue-700",
      Open: "bg-blue-100 text-blue-700",
      "In Progress": "bg-amber-100 text-amber-700",
      Resolved: "bg-green-100 text-green-700",
      Closed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Low: "bg-green-100 text-green-700 border-green-200",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Critical: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setDeletingTicket(ticket);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTicket) return;

    try {
      await ticketService.delete(deletingTicket.id);
      toast.success("Ticket deleted successfully");
      setShowDeleteModal(false);
      setDeletingTicket(null);
      setSelectedTicket(null);
      fetchTickets();
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const handleViewClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageClick = (imageUrl: string) => {
    setFullImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handlePrevImage = () => {
    if (selectedTicket?.imageUrls && selectedTicket.imageUrls.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? selectedTicket.imageUrls!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedTicket?.imageUrls && selectedTicket.imageUrls.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === selectedTicket.imageUrls!.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
            <p className="text-sm text-gray-600 mt-2">
              Showing {tickets.length > 0 ? `1-${tickets.length}` : "0"} of {totalElements} tickets
            </p>
          </div>
          <Link href="/tickets/create">
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ticket ID, title, description, or company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="bg-gray-400 rounded-lg shadow-card p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-card p-12 text-center">
          <p className="text-gray-500 mb-4">No tickets found</p>
          <Link href="/tickets/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Ticket
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-[100px]">
                    Ticket ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[250px]">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-[180px]">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                    User Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-[120px]">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary font-semibold text-sm">
                        #{ticket.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[300px]">
                        {ticket.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(ticket.createdTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 truncate">
                        {ticket.categoryName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {ticket.createdUserId ? `User #${ticket.createdUserId}` : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          getPriorityColor(ticket.priorityName || "Medium")
                        }`}
                      >
                        {ticket.priorityName || "Medium"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewClick(ticket)}
                          className="p-2 hover:bg-gray-100 rounded-md transition-all duration-200 text-gray-600 hover:text-primary group relative"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <DropdownMenu
                          open={openMenuId === ticket.id}
                          onOpenChange={(open) => setOpenMenuId(open ? ticket.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 hover:bg-gray-100 rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                              title="More Actions"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuItem
                              onClick={() => router.push(`/tickets/${ticket.id}/edit`)}
                              className="cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success("Toggle activation feature coming soon");
                                setOpenMenuId(null);
                              }}
                              className="cursor-pointer text-amber-700 focus:text-amber-900 focus:bg-amber-50"
                            >
                              <Power className="w-4 h-4 mr-2" />
                              Deactivate Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                handleDeleteClick(ticket);
                                setOpenMenuId(null);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Ticket
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-card p-4">
          <div className="text-sm text-gray-700">
            Showing page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[800px] w-full my-8 max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white font-bold text-sm">
                  #{selectedTicket.id}
                </div>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setSelectedImageIndex(0);
                  }}
                  className="text-white/80 hover:text-white transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                {selectedTicket.name}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                  {selectedTicket.currentStatusName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                  {selectedTicket.priorityName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                  {selectedTicket.serviceTypeName}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-240px)] overflow-y-auto">
              {/* Description */}
              {selectedTicket.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Images Section */}
              {selectedTicket.imageUrls && selectedTicket.imageUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Attachments ({selectedTicket.imageUrls.length})
                  </h3>
                  <div className="relative">
                    {/* Main Image Display */}
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={selectedTicket.imageUrls[selectedImageIndex]}
                        alt={`Attachment ${selectedImageIndex + 1}`}
                        className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(selectedTicket.imageUrls![selectedImageIndex])}
                      />
                      
                      {/* Navigation Arrows (if multiple images) */}
                      {selectedTicket.imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {selectedTicket.imageUrls.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip (if multiple images) */}
                    {selectedTicket.imageUrls.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {selectedTicket.imageUrls.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === selectedImageIndex
                                ? 'border-primary ring-2 ring-primary/30'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ticket Information Grid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ticket Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <p className="text-xs font-medium text-purple-700">Company</p>
                    </div>
                    <p className="text-sm font-semibold text-purple-900">
                      {selectedTicket.companyName}
                    </p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <p className="text-xs font-medium text-indigo-700">Category</p>
                    </div>
                    <p className="text-sm font-semibold text-indigo-900">
                      {selectedTicket.categoryName}
                    </p>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-cyan-600" />
                      <p className="text-xs font-medium text-cyan-700">Subcategory</p>
                    </div>
                    <p className="text-sm font-semibold text-cyan-900">
                      {selectedTicket.subcategoryName}
                    </p>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-teal-600" />
                      <p className="text-xs font-medium text-teal-700">Service Type</p>
                    </div>
                    <p className="text-sm font-semibold text-teal-900">
                      {selectedTicket.serviceTypeName}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-700">Current Status</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {selectedTicket.currentStatusName}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-medium text-gray-700">Submitted Status</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedTicket.submittedStatusName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Created</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedTicket.createdTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Created By</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      User #{selectedTicket.createdUserId}
                    </span>
                  </div>
                  {selectedTicket.updatedTime && (
                    <>
                      <div className="border-t border-gray-300 my-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Last Updated</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(selectedTicket.updatedTime)}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedTicket.updatedByUserId && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Updated By</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        User #{selectedTicket.updatedByUserId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTicket(null);
                  setSelectedImageIndex(0);
                }}
                className="px-5 py-2.5"
              >
                Close
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/tickets/${selectedTicket.id}/edit`);
                    setSelectedTicket(null);
                  }}
                  className="gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 px-5 py-2.5"
                >
                  <Edit className="w-4 h-4" />
                  Edit Ticket
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteClick(selectedTicket);
                  }}
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-5 py-2.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in duration-200"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullImageUrl}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-[500px] w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Ticket</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Are you sure?</h3>
                  <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-4">
                You are about to delete ticket{" "}
                <strong className="font-semibold text-gray-900">#{deletingTicket.id} - {deletingTicket.name}</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5"
              >
                Delete Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
