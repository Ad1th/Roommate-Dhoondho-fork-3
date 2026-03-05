import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      minlength: 8,
    },
    firstname: {
      type: String,
      default: null,
    },
    lastname: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    regnum: {
      type: String,
      default: null,
      minlength: 7,
      maxlength: 12,
    },
    gender: {
      type: String,
      default: null,
    },
    rank: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },
    isRankVerified: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      default: null,
      min: 1,
      max: 8,
    },
    mobile: {
      type: Number,
      min: 10000000,
      max: 999999999999999,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    about: {
      type: String,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    likesRoommate: {
      type: Array,
      default: [],
    },
    likesRoom: {
      type: Array,
      default: [],
    },
    activeChats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    post: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
