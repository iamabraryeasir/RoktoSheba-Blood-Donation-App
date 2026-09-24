import { z } from "zod";

export const profileEditSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  phone: z
    .string()
    .min(11, "Please enter a valid Bangladesh phone number (+8801...)")
    .max(15, "Invalid phone number format"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  area: z.string().min(1, "Area / Upazila is required"),
  addressDetail: z.string().optional(),
});

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
