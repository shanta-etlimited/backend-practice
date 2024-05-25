import {z} from "zod"

const userNameValidationSchema = z.object({
    firstName: z.string()
      .trim()
      .max(20, "First name cannot be more than 20 characters"),
    middleName: z.string().optional(),
    lastName: z.string()
  });
  
  // Guardian schema
  const guardianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string()
  });
  
  // Local guardian schema
  const localGuardianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string()
  });
  
  // Student schema
  const studentValidationSchema = z.object({
    id: z.string(),
    password: z.string().max(20),
    name: userNameValidationSchema,
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: z.string().optional(),
    email: z.string()
      .email("Student email is not a valid email"),
    contactNumber: z.string(),
    emergencyContactNumber: z.string(),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
    presentAddress: z.string(),
    permanentAddress: z.string(),
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: z.string().optional(),
    isActive: z.enum(["active", "blocked"]).default("active"),
    isDeleted: z.boolean().default(false)
  });

  export default studentValidationSchema;