import { Schema , model} from "mongoose";
import { TGuardian, TLocalGuardian, TStudent, StudentMethod, StudentModel, TUserName } from "./student.interface";
import validator from 'validator';
import bcrypt from 'bcrypt'
import config from "../../config";

export const userNameSchema = new Schema<TUserName>({
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
      validate:{
        validator: (value: string)=> validator.isAlpha(value),
        message: "{VALUE} is not valid"
      }
    },
})

export const guardianSchema = new Schema<TGuardian>({
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

export const localGuardianSchema = new Schema<TLocalGuardian>({
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

const studentSchema = new Schema<TStudent, StudentModel, StudentMethod>({
    id: { type: String , required: [true, "Student id is required"], unique: true},
    password: { type: String, required: [true, "Student password is required"], maxLength: [20, "Password cannot be more than 20 characters"]},
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
      unique: true,
      validate:{
        validator: (value: string)=> validator.isEmail(value),
        message: "{VALUE} is not a valid email"
      }
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
    isDeleted: {
      type: Boolean,
      default: false
    }
}, {
  toJSON: {
    virtuals: true
  }
});


//virtual
studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})


//pre save middleware/hook: will work on create() save()
studentSchema.pre("save", async function (next) {
  // console.log(this, "pre hook: we will save the data")

  //hashing password and save into db
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds))
  next()
})

//post save middleware/hook
studentSchema.post("save", async function (doc, next) {
  doc.password = ""
  // console.log(this, "post hook: we just saved the data")
  next()
})

//query middleware
studentSchema.pre("find", function (next) {
  this.find({isUpdated: { $ne: true }})
  next()
  
})

studentSchema.pre("findOne", function (next) {
  this.find({isUpdated: { $ne: true }})
  next()
  
})

studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({$match: {isUpdated: { $ne: true }}});
  next()
  
})


studentSchema.pre("find", function (next) {
  this.find({isDeleted: { $ne: true }})
  next()
  
})

studentSchema.pre("findOne", function (next) {
  this.find({isDeleted: { $ne: true }})
  next()
  
})

studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({$match: {isDeleted: { $ne: true }}});
  next()
  
})

//creating a custom instance method
studentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({id});
  return existingUser
}

export const Student = model<TStudent, StudentModel>("Student", studentSchema)

