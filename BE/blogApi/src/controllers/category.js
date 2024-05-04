"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Category Controller:

const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Category"]
      #swagger.summary = "List Categories"
      #swagger.description = `You can send query with endpoint for filter[], search[], sort[], page and limit.
      <ul> Examples:
          <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
          <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
          <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
          <li>URL/?<b>page=2&limit=1</b></li>
      </ul> 
      `
    */

    //? query her zaman str gelir.
    let filter = {};
    if (req.query.pg === "null") {
      filter.parentCategoryIds = [];
    }
    const data = await res.getModelList(Category, filter);

    //? For activity raw data: sorgu için yan yana yazdırdım
    // data.map((category) => {
    //   process.stdout.write(category.name + ' ');
    // })

    // console.log(req.query);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Category),
      data: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Category"]
      #swagger.summary = "Create Category"
      #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            $ref: "#/definitions/Category"
        }
      }
    */

    let data;

    //? parent category control:
    if (req.body?.parentCategoryIds) {
      for (const parentCategoryId of req.body.parentCategoryIds) {
        const parentCategory = Category.findOne({ _id: parentCategoryId });
        if (!parentCategory) {
          return res.status(400).send({
            error: true,
            message: "Parent category not found",
          });
        }
      }

      data = await Category.create(req.body);
      parentCategory.subCategoryIds.push(data._id);
      await parentCategory.save();
    }

    //? subcategory control:
    if (req.body?.subCategoryIds) {
      for (const subCategoryId of req.body.subCategoryIds) {
        const subCategory = Category.findOne({ _id: subCategoryId });
        if (!subCategory) {
          return res.status(400).send({
            error: true,
            message: "Sub category not found",
          });
        }
      }
      data = await Category.create(req.body);
      subCategory.parentCategoryIds.push(data._id);
      await subCategory.save();
    }

    if (!req.body?.subCategoryIds && !req.body?.parentCategoryIds) {
      data = await Category.create(req.body);
    }

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Category"]
      #swagger.summary = "Get Single Category"
    */
    const data = await Category.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Category"]
      #swagger.summary = "Update Category"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $ref: '#/definitions/Category',
        }
      }
    */
    //? permission isAdmin => router da

    const data = await Category.updateOne({ _id: req.params.id }, req.body);
    const newdata = await Category.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      body: req.body,
      data: data, // info about update
      // güncel veriyi istiyorsan tekrar çağır
      newdata: newdata,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Category"]
      #swagger.summary = "Delete Category"
    */
    const data = await Category.deleteOne({ _id: req.params.id });
    // console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
