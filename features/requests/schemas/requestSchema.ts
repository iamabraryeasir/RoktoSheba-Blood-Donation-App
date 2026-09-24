import { z } from "zod";

const bloodGroupEnum = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
] as const);

const urgencyEnum = z.enum(["normal", "urgent", "critical"] as const);

export const createRequestSchema = z.object({
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name is too long")
    .transform((v) => v.trim()),
  bloodGroup: bloodGroupEnum,
  hospitalName: z
    .string()
    .min(3, "Hospital/Clinic name is required")
    .max(150, "Hospital name is too long")
    .transform((v) => v.trim()),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  area: z.string().min(1, "Area / Upazila is required"),
  neededDate: z.string().min(1, "Needed date is required"),
  neededTime: z.string().min(1, "Please select a valid time"),
  urgency: urgencyEnum,
  contactNumber: z
    .string()
    .min(11, "Enter a valid Bangladesh phone number (+8801...)")
    .max(16, "Phone number is too long")
    .regex(
      /^(?:\+?8801|01)[3-9]\d{8}$/,
      "Please enter a valid Bangladesh phone number (e.g. +8801XXXXXXXXX)",
    )
    .transform((v) => v.trim()),
  documentImageUri: z.string().nullable().optional(),
});

export type CreateRequestFormData = z.infer<typeof createRequestSchema>;
