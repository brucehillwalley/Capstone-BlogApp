"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Activity Model:

const {mongoose} = require("../configs/dbConnection");

const ActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
      required: true,   
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: [String],
      default:
        ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzDgGnJSZdFQDF1uJ9PzOHPY_2c0uJV6cYWQ&s"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    hasPrice: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
      default: null,

      //? TRY LATER
      // GeoJSON point schema for location
      // type: {
      //   type: String,
      //   enum: ["Point"], // GeoJSON point type
      // },
      // coordinates: {
      //   type: [Number], // Array of longitude and latitude coordinates
      //   required: true,
      //   index: "2dsphere", // Geospatial index for efficient location-based searches
      // },

    },
    isOutDoor: {
      type: Boolean,
      default: false,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    slug: { // Yeni alan: URL dostu metin
      type: String,
      required: true,
      trim: true,
      unique: true,
      
      default: function() {
        return this.title.toLowerCase().replace(/\s+/g, '-');
      }
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
    collection: "activities",
    timestamps: true,
  }
);

// Index for efficient retrieval of activities based on userId and timestamp
// activitySchema.index({ userId: 1, createdAt: -1 });
// activitySchema.index({ categoryId: 1 }); // Index for category lookup
// activitySchema.index({ title: "text", content: "text" }); // Full-text search index
// activitySchema.index({ location: "2dsphere" }); // Geospatial index for location-based searches

// Populate category field during retrieval
// activitySchema.pre("find", function (next) {
//   this.populate("categoryId");
//   next();
// });

module.exports = mongoose.model("Activity", ActivitySchema);

// İndeks Kullanımı: "ActivityBlog" koleksiyonunu userId veya timestamp (veya her ikisini birden) içeren kriteriler kullanarak sorguladığınızda, MongoDB bu indeksi kullanarak sorguların performansını önemli ölçüde artıracaktır.
// İndeksin Faydaları: İndeksler, MongoDB'nin eşleşen belgeleri bulmak için tüm koleksiyonu taramayı önlemesine yardımcı olur. Bunun yerine, verilerin ilgili kısımlarına doğrudan veritabanını yönlendirerek G/Ç işlemlerinin sayısını ve genel sorgu yürütme süresini azaltır.