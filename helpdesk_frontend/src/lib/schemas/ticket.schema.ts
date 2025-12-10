import * as z from "zod";

export const createTicketSchema = z.object({
  name: z.string().min(1, "Title is required").max(150, "Title must be less than 150 characters"),
  description: z.string().optional(),
  companyId: z.number({
    required_error: "Company is required",
    invalid_type_error: "Please select a company",
  }).min(1, "Company is required"),
  categoryId: z.number({
    required_error: "Category is required",
    invalid_type_error: "Please select a category",
  }).min(1, "Category is required"),
  subcategoryId: z.number({
    required_error: "Subcategory is required",
    invalid_type_error: "Please select a subcategory",
  }).min(1, "Subcategory is required"),
  statusId: z.number({
    required_error: "Status is required",
    invalid_type_error: "Please select a status",
  }).min(1, "Status is required"),
  priorityId: z.number({
    required_error: "Priority is required",
    invalid_type_error: "Please select a priority",
  }).min(1, "Priority is required"),
  serviceTypeId: z.number({
    required_error: "Service type is required",
    invalid_type_error: "Please select a service type",
  }).min(1, "Service type is required"),
  sortOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
  images: z.array(z.instanceof(File)).optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
