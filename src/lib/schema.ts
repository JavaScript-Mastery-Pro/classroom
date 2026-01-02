import * as z from "zod";

export const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "teacher", "student"], {
    required_error: "Please select a role",
  }),
  department: z.string(),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  code: z.string().min(5, "Subject code must be at least 5 characters"),
  description: z
    .string()
    .min(5, "Subject description must be at least 5 characters"),
  department: z
    .string()
    .min(2, "Subject department must be at least 2 characters"),
});

const scheduleSchema = z.object({
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const classSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(50, "Class name must be at most 50 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must be at least 5 characters"),
  subjectId: z.coerce
    .number({
      required_error: "Subject is required",
      invalid_type_error: "Subject is required",
    })
    .min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  capacity: z.coerce
    .number({
      required_error: "Capacity is required",
      invalid_type_error: "Capacity is required",
    })
    .min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "inactive"]),
  bannerUrl: z
    .string({ required_error: "Class banner is required" })
    .min(1, "Class banner is required"),
  bannerCldPubId: z
    .string({ required_error: "Banner reference is required" })
    .min(1, "Banner reference is required"),
  inviteCode: z.string().optional(),
  schedules: z.array(scheduleSchema).optional(),
});

export const enrollmentSchema = z.object({
  classId: z.coerce
    .number({
      required_error: "Class ID is required",
      invalid_type_error: "Class ID is required",
    })
    .min(1, "Class ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
});
