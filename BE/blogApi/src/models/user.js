"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "username": "test",
    "password": "1234",
    "email": "test@site.com",
    "isActive": true,
    "isAuthor": false,
    "isAdmin": false
}
/* ------------------------------------------------------- */
// User Model:

const passwordEncrypt = require("../helpers/passwordEncrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      set: (password) => {
        if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
        ) {
          return passwordEncrypt(password);
        } else {
          throw new Error("Password type is not correct.");
        }
      },
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Email field must be required"],
      unique: [true, "There is this email. Email field must be unique"],
      validate: [
        (email) => {
          const regexEmailCheck =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return regexEmailCheck.test(email);
        },
        "Email type is not correct.",
      ],
    },
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // isAuthor: {
    //   type: Boolean,
    //   default: false,
    // },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    //! login olmayan kullanıcılara reader rolu verebilirsin
    // role: { type: String, required: true, enum: ['admin', 'author', 'reader'] },

    profilePicture: { type: String },
    bio: { type: String },
    website: { type: String },
    social: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    preferences: {
      language: { type: String, default: "tr" }, // Varsayılan dil
      timezone: { type: String, default: "UTC+03:00" }, // Varsayılan zaman dilimi
    },
    actionsActivity: {
      Viewed: { type: mongoose.Schema.Types.ObjectId, ref: "View" }, // Görüntülenen gönderi sayısı
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Kullanıcı yorumları
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }], // Kullanıcı beğenileri
    },
    actionsActivityPlan: {
      Viewed: { type: mongoose.Schema.Types.ObjectId, ref: "ViewPlan" }, // Görüntülenen plan sayısı
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "CommentPlan" }], // Kullanıcı yorumları
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "LikePlan" }], // Kullanıcı beğenileri
    },
    deletedAt: {
      //?SOFT DELETE
      type: Date,
      default: null,
    },
    deletedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

/* ------------------------------------------------------- */
module.exports = mongoose.model("User", UserSchema);
