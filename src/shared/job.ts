import {z} from "zod";

export const JobStatusSchema = z.enum([
 "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
  "archived",
]);

export type JobStatus = z.infer<typeof JobStatusSchema>;

// Full persisted entity returned by the API.
// Dates are ISO strings to keep JSON transport simple and consistent.
export const JobSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1).max(200).optional(),
  location: z.string().min(1).max(200).optional(),
  url: z.string().url().optional(),
  status: JobStatusSchema,
  notes: z.string().max(5000).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Job = z.infer<typeof JobSchema>;

// Input when creating a job.
// Note: no id/createdAt/updatedAt here (server sets them).
export const JobCreateInputSchema = z.object({
  title: JobSchema.shape.title,
  company: JobSchema.shape.company,
  location: JobSchema.shape.location,
  url: JobSchema.shape.url,
  notes: JobSchema.shape.notes,
  // Optional: allow setting initial status, default will be "draft" in use-case.
  status: JobStatusSchema.optional(),
});

export type JobCreateInput = z.infer<typeof JobCreateInputSchema>;
export type JobCreateData = Omit<JobCreateInput, "status"> & {
  status: z.infer<typeof JobStatusSchema>;
};

// Input when updating a job (PATCH-like).
// Explicitly restrict fields that are allowed to change.
export const JobUpdateInputSchema = z
  .object({
    title: JobSchema.shape.title.optional(),
    company: JobSchema.shape.company,
    location: JobSchema.shape.location,
    url: JobSchema.shape.url,
    notes: JobSchema.shape.notes,
    status: JobStatusSchema.optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided for update",
  });

export type JobUpdateInput = z.infer<typeof JobUpdateInputSchema>;