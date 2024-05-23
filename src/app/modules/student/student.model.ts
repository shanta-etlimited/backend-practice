import { Schema , model, connect} from "mongoose";
import { Guardian, LocalGuardian, Student, UserName } from "./student.interface";


const userNameSchema = new Schema<UserName>({
    firstName: { 
      type: String, 
      required: [true, "Student first name is required"],
      trim: true,
      maxlength: [20, "First name cannot be more than  characters"],
      validate: {
        validator: function (value: string){
          const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
          return firstNameStr === value;
          
        },
        message: "{VALUE} is not in capitalize format"  
      }
    },
    middleName: { 
      type: String 
    },
    lastName: { 
      type: String, 
      required: [true, "Student last name is required"], 
    },
})

const guardianSchema = new Schema<Guardian>({
    fatherName: { 
      type: String, 
      required: true 
    },
    fatherOccupation: {
      type: String, 
      required: true
    },
    fatherContactNo: { 
      type: String, 
      required: true 
    },
    motherName: { 
      type: String, 
      required: true 
    },
    motherOccupation: {
        type: String, 
        required: true
    },
    motherContactNo: { 
      type: String, 
      required: true 
    },  
})

const localGuardianSchema = new Schema<LocalGuardian>({
    name: { 
      type: String, 
      required: true 
    },
    occupation: {
      type: String, 
      required: true
    },
    contactNo: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
})

const studentSchema = new Schema<Student>({
    id: { type: String , required: true, unique: true},
    name: {
      type: userNameSchema,
      required: [true, "Student name is required"],
    },
    gender:  {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not supported',
      },
      required: [true, "Student gender is required"],
    },
    dateOfBirth: { 
      type: String, 
    },
    email: { 
      type: String, 
      required: [true, "Student email is required"],
      unique: true
    },
    contactNumber: { 
      type: String, 
      required: [true, "Student contact number is required"] 
    },
    emergencyContactNumber: { 
      type: String, 
      required: [true, "Student emergency contact number is required"]
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    presentAddress: { 
      type: String, 
      required: [true, "Student present address is required"] 
    },
    permanentAddress: { 
      type: String, 
      required: [true, "Student permanent address is required"] 
    },
    guardian: {
      type: guardianSchema,
      required: [true, "Student guardian is required"]
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "Student local guardian is required"]
    },
    profileImg: { 
      type: String
    },
    isActive: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    },
});

export const StudentModel = model<Student>("Student", studentSchema)