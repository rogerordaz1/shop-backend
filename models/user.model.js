import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    street: { type: String, trim: true },
    apartment: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
    resetPasswordOtpNumber: { type: Number, trim: true },
    resetPasswordOtpExpires: { type: Date },
    isAdmin: { type: Boolean, default: false },
    wishlist: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        productPrice: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// userSchema.index({ email: 1 } , { unique: true });

const User = model("User", userSchema);

export default User;