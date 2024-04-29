"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const { Like } = require("../models/like");
//? activity ve comment modellerinde "likeCount" alanı olması gerekiyor. Bu fonk Like delete create işlemlerinden sonra likeCount'u güncelleyebilir.

// Helper function to update like count for the associated item (post or comment)
module.exports = async function updateItemLikeCount(itemId, itemType) {
  try {
    const model = itemType === "post" ? Post : Comment; // Assuming you have Post and Comment models
    const item = await model.findById(itemId);

    if (!item) {
      return null; // Item not found
    }

    const likeCount = await Like.countDocuments({ itemId });
    item.likeCount = likeCount;
    await item.save();

    return item;
  } catch (error) {
    console.error(error);
    return null;
  }
};
