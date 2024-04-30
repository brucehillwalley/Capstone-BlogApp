"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Comment Model:

const {mongoose} = require("../configs/dbConnection");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },   
    comment: {
      type: String,
      trim: true,
      required: true,   
    },
    allEdits: {
      type: [String],
      default: null,
    },
    likeCount: {
       type: Number,
       default: 0, 
    },   
    //?SOFT DELETE
    deletedAt: {
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
    deletedReason: {
      type: String,
      default: null,
    },
  },
  {
    collection: "comments",
    timestamps: true,
  }
);

// Index for efficient retrieval of activities based on userId and timestamp
// CommentSchema.index({ userId: 1, createdAt: -1 });
// CommentSchema.index({ activityId: 1 }); // Index for activity lookup

module.exports = mongoose.model("Comment", CommentSchema);
