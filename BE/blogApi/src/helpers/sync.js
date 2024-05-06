"use strict";
/*-------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
/*
    $ npm i axios 
*/

/*-------------------------------------------------------*/

class MyLodash {
  constructor() {}
  static sample(arr) {
    if (!arr || !arr.length) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  static random(min, max) {
    if (min === undefined || max === undefined) {
      throw new Error("Both min and max values are required.");
    }
    if (min > max) {
      throw new Error("min must be less than or equal to max.");
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// console.log(MyLodash.random(0,5));
/*-------------------------------------------------------*/
const axios = require("axios");
const User = require("../models/user");
const Activity = require("../models/activity");
const activityData = require("./data/activityData");
const Category = require("../models/category");
const categoriesData = require("./data/categoryData");
const Like = require("../models/like");
const commentData = require("./data/commentData");
const Comment = require("../models/comment");

//? USERS...........................................................
const transferUsersCollection = async () => {
  const { data } = await axios.get(`https://dummyjson.com/users`);
  const dummyUsers = data.users;
  await User.create({
    username: "admin",
    password: "Bruce123*",
    email: "admin@site.com",
    isAdmin: true,
  });
  console.log("- 1 Admin user created.");

  dummyUsers.forEach(async (user) => {
    await User.create({
      ...user,
      id: null,
      password: user.password + "*123",
      profilePicture: user.image,
    });
  });
  console.log(
    `${dummyUsers.length} users successfully transferred to the database.`
  );
};

//? CATEGORIES.......................................................

async function insertCategories() {
  for (const categoryData of categoriesData) {
    let subcategories = []; // Alt kategori nesnelerini tutmak için dizi

    let category = new Category({
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, "-"), // Slug'ı adından oluştur
      // ... diğer kategori özellikleri
    });
    await category.save();
    console.log(`- Category ${category.name} created.`);

    if (categoryData.subcategories) {
      for (const subcategoryData of categoryData.subcategories) {
        let subcategory;
        if (!(await Category.findOne({ name: subcategoryData.name }))) {
          subcategory = new Category({
            name: subcategoryData.name,

            // ... diğer alt kategori özellikleri
          });
        } else {
          subcategory = await Category.findOne({ name: subcategoryData.name });
        }

        subcategory.parentCategoryIds.push(category._id);
        await subcategory.save();
        console.log(`-    Subcategory ${subcategory.name} created.`);

        if (subcategoryData.subcategories) {
          let subsubcategories = [];
          for (const subsubcategoryData of subcategoryData.subcategories) {
            let subsubcategory;
            if (!(await Category.findOne({ name: subsubcategoryData.name }))) {
              subsubcategory = new Category({
                name: subsubcategoryData.name,

                // ... diğer alt kategori özellikleri
              });
            } else {
              subsubcategory = await Category.findOne({
                name: subsubcategoryData.name,
              });
            }

            subsubcategory.parentCategoryIds.push(subcategory._id);
            await subsubcategory.save();
            subsubcategories.push(subsubcategory._id);

            console.log(
              `-        Subsubcategory ${subsubcategory.name} created.`
            );
          }
          subcategory.subCategoryIds = subsubcategories;
          await subcategory.save();
        }

        subcategories.push(subcategory._id); // Alt kategori _id'sini subcategories dizisine ekle
      }
    }

    (category.subCategoryIds = subcategories), await category.save();
  }
}
//? ACTIVITIES.......................................................
async function insertActivities() {
  const randomUsers = await User.find();

  activityData.forEach(async (activity) => {
    activity.userId = MyLodash.sample(randomUsers)._id;

    activity.categoryId = (
      await Category.findOne({
        name: activity.categoryName.toLowerCase(),
      })
    )._id;

    await Activity.create(activity);
    console.log(`- Activity ${activity.title} created.`);
  });
}
//? COMMENTS.........................................................
async function insertComments() {
  const commentUsers = await User.find();
  const commentActivities = await Activity.find();
  console.log(`- ALL COMMENTS...............`);
 await ( commentUsers.forEach(async (user) => {
    let comment = MyLodash.sample(commentData);
    comment.userId = user._id;
    comment.activityId = MyLodash.sample(commentActivities)._id;
    await Comment.create(comment);
    console.log(`- Comment ${comment.comment} created.`);
  }))

  
}
//? LIKES............................................................
async function insertLikes() {
  const likeUsers = await User.find();
  const likeActivities = await Activity.find();
  const likeComments = await Comment.find();

  console.log(`- ALL LIKES.............`);
  likeUsers.slice(0, likeUsers.length / 2).forEach(async (user) => {
    likeActivities.forEach(async (activity) => {
      await Like.create({
        userId: user._id,
        itemId: activity._id,
        itemType: "activity",
      });
      console.log(
        `- Like created for USER: ${user.username} and ACTIVITY: ${activity.title}.`
      );
    });

    likeComments.forEach(async (comment) => {
      await Like.create({
        userId: user._id,
        itemId: comment._id,
        itemType: "comment",
      });
      console.log(
        `- Like created for USER: ${user.username} and COMMENT: ${comment.comment}.`
      );
    });
  });
 
}
//? DROP DATABASE....................................................
async function cleanCollections() {
  try {
    const { mongoose } = require("../configs/dbConnection");
    await mongoose.connection.dropDatabase();
    console.log("- Database and all data DELETED!");
  } catch (error) {
    console.log("- ERROR: Database and all data NOT DELETED", error);
  }
}
/*-------------------------------------------------------*/

module.exports = async () => {
  //! Emniyet
  return null

  await cleanCollections();
  try {
    await transferUsersCollection();
    await insertCategories();
    await insertActivities();
    await insertComments();
    await insertLikes();
  } catch (error) {
    console.log("- ERROR: Transfer Failed ", error);
  }
};
