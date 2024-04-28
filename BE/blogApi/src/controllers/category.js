"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Category Controller:

const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    // const data = await Category.find()
    const data = await res.getModelList(Category);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Category),
      data: data,
    });
  },
  create: async (req, res) => {
    let data;
    //? parent category control:
    if (req.body?.parentCategoryId) {
      const parentCategory = await Category.findOne({
        _id: req.body.parentCategoryId,
      });
      if (!parentCategory) {
        return res.status(400).send({
          error: true,
          message: "Parent category not found",
        });
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
      subCategory.parentCategoryId = data._id;
      await subCategory.save();
    }

    if (!req.body?.subCategoryIds && !req.body?.parentCategoryId) {
      data = await Category.create(req.body);
    }

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    const data = await Category.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {

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
    const data = await Category.deleteOne({ _id: req.params.id });
    // console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
