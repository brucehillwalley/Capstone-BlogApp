"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
  const newLike = new Like({
  userId: user._id,
  itemId: post._id, // Or comment._id
  itemType: 'post', // Or 'comment'
  reactionType: 'like', // Optional
});

await newLike.save();
}
// Get all likes for a activity
const activityLikes = await Like.find({ itemId: activityId, itemType: 'activity' });

// Get all likes for a user (including activities and comments)
const userLikes = await Like.find({ userId: userId });

/* ------------------------------------------------------- */
// like Model:

const LikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      // Item being liked (activity or comment)
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      itemType: {
        type: String,
        enum: ['activity', 'comment'], // Specify item types
        required: true,
      },
      reactionType: {
        type: String,
        enum: ['like', 'dislike', 'love'], // Example reaction types
        default: 'like',
      },
   
},{
    timestamps: true,
    collection: 'likes',
}
)
// Index for efficient retrieval of likes based on userId and itemId
LikeSchema.index({ userId: 1, itemId: 1 }, { unique: true });

/* ------------------------------------------------------- */
module.exports = mongoose.model('Like', LikeSchema)