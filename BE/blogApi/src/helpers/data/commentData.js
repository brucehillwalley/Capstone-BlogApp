"use strict"

const { default: mongoose } = require("mongoose");

module.exports=[
    // Comment 1 (Active, First Edit)
    {
      comment: "This is a great post! I learned a lot.",
      allEdits: ["This is a great post! I learned a lot."], // Initial comment saved
      likeCount: 5,
      isDeleted: false,
      createdAt: new Date(),
    },
    // Comment 2 (Active, Edited)
    {
      comment: "This post has some interesting insights.",
      allEdits: [
        "This post is good.", // Initial comment saved
        "This post has some interesting insights.", // Edited comment saved
      ],
      likeCount: 2,
      isDeleted: false,
    },
    // Comment 3 (Deleted)
    {userId:new mongoose.Types.ObjectId,
      comment: "This post could be improved with more details.",
      allEdits: ["This post could be improved with more details."],
      likeCount: 0,
      isDeleted: true,
      deletedAt: new Date("2024-03-29T09:00:00.000Z"), // Set deletion timestamp
      deletedId: this.userId, // User who deleted the comment (optional)
      deletedReason: "Not relevant anymore", // Reason for deletion (optional)
    },{
        comment: "This is a well-written and informative post. Thanks for sharing!",
        allEdits: ["This is a well-written and informative post. Thanks for sharing!"],
        likeCount: 8,
        isDeleted: false,
        createdAt: new Date("2024-04-25T12:30:00.000Z"), // Past date
      },
      // Comment 2 (Active, Multiple Edits)
      {
        comment: "I agree with the previous comment. This post is very insightful.",
        allEdits: [
          "This post is interesting.", // Initial comment saved
          "I agree with the previous comment. This post is very insightful.", // Edited comment saved
          "I particularly enjoyed the section on [topic of the post].", // Second edit saved
        ],
        likeCount: 3,
        isDeleted: false,
        createdAt: new Date("2024-05-01T10:00:00.000Z"), // Current date
      },
      // Comment 3 (Active)
      {
        comment: "Looking forward to reading more content like this!",
        allEdits: ["Looking forward to reading more content like this!"],
        likeCount: 1,
        isDeleted: false,
        createdAt: new Date("2024-04-30T18:00:00.000Z"), // Recent date
      },
      // Comment 4 (Deleted, No Deletion Info)
      {
        comment: "This comment is no longer relevant.",
        allEdits: ["This comment is no longer relevant."],
        likeCount: 0,
        isDeleted: true,
        deletedAt: new Date("2024-04-28T15:00:00.000Z"), // Past date
      },
      // Comment 5 (Deleted, With Deletion Info)
      {userId:new mongoose.Types.ObjectId,
        comment: "This comment was removed due to offensive language.",
        allEdits: ["This comment was removed due to offensive language."],
        likeCount: 0,
        isDeleted: true,
        deletedAt: new Date("2024-04-29T09:00:00.000Z"), // Past date
        deletedId: this.userId, // Replace with actual user ID
        deletedReason: "Offensive language",
      }
  ];
  