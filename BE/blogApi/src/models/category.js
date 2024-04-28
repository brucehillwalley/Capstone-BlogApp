"use strict";
const { set } = require("mongoose");
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *

/* ------------------------------------------------------- */
// Category Model:

// const CategorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
//     },

//   },{
//     collection: 'blogCategory',
//     timestamps: true
// }
// )

// module.exports = mongoose.model("Category", CategorySchema)

/* ------------------------------------------------------- */

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Eşsiz kategori adları sağlar
  },
  description: {
    type: String,
    trim: true,
  },
  slug: { // Yeni alan: URL dostu metin
    type: String,
    required: true,
    trim: true,
    unique: true,
    default: function() {
      return this.name.toLowerCase().replace(/\s+/g, '-');
    }
  },
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory', // Üst kategoriler için aynı modeli referans alır
  },
  subCategoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory', // Alt kategoriler için aynı modeli referans alır
  }],
  icon: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
}, {
  collection: 'blogCategory', 
  timestamps: true, 
});

module.exports = mongoose.model('BlogCategory', blogCategorySchema);

