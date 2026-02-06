import { Schema, model, models} from "mongoose";

const UserSchema = new Schema({

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
      select: false,
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
      default: "credentials",
    },
  },

  { timestamps: true }

);

export default models.User || model("User", UserSchema);