import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters long'],
      maxLength: [50, 'Name must be at most 50 characters long'],
      validate: {
        validator: (value) => /^[a-zA-Z\s]+$/.test(value),
        message: 'Name can only contain letters and spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,11}$/.test(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long'],
      // validate: {
      //   validator: (value) => /^[a-zA-Z\d_.,*$#@]{8,}$/.test(value),
      //   message: 'Password must contain at least one letter and one number',
      // },
    },
    tokenJWT: {
      type: String,
      required: [true, 'JWT token is required'],
      unique: true,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true,
        minLength: [5, 'Street must be at least 5 characters long'],
        maxLength: [100, 'Street must be at most 100 characters long'],
        validate: {
          validator: (value) => /^[a-zA-Z0-9\s]+$/.test(value),
          message: 'Street can only contain letters, numbers, and spaces',
        },
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        minLength: [2, 'City must be at least 2 characters long'],
        maxLength: [50, 'City must be at most 50 characters long'],
        validate: {
          validator: (value) => /^[a-zA-Z\s]+$/.test(value),
          message: 'City can only contain letters and spaces',
        },
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        minLength: [2, 'State must be at least 2 characters long'],
        maxLength: [50, 'State must be at most 50 characters long'],
        validate: {
          validator: (value) => /^[a-zA-Z\s]+$/.test(value),
          message: 'State can only contain letters and spaces',
        },
      },
      zip: {
        type: String,
        required: [true, 'ZIP code is required'],
        trim: true,
        validate: {
          validator: (value) => /^\d{5}(-\d{4})?$/.test(value),
          message: 'Invalid ZIP code format',
        },
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (value) => /^\+?[1-9]\d{1,14}$/.test(value),
        message: 'Invalid phone number format',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      validate: {
        validator: (value) => ['user', 'admin'].includes(value),
        message: 'Role must be either user or admin',
      },
    },
  },
  {
    timestamps: true, // Esto es para añadir los campos createdAt y updatedAt automáticamente
  }
);

// plugins (en este caso usamnos mongoose-paginate-v2 para paginación)
userSchema.plugin(mongoosePaginate);


//                    model(Nombre_modelo, esquema)
const User = mongoose.model('User', userSchema);

export default User;
