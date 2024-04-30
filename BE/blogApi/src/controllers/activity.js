"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Activity Controller:

const Activity = require("../models/activity");
const Category = require("../models/category");

module.exports = {
  list: async (req, res) => {
    const customFilters = {
      isPublished: true,
      isDeleted: false,
    };

    if (req.user?.isAdmin) {
      customFilters = {};
    }

    const data = await res.getModelList(Activity, customFilters);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Activity, customFilters),
      data: data,
    });
  },
  create: async (req, res) => {
    //? crate kullanıcının kendi id'si ile olması lazım
    req.body.userId = req.user._id;

    //? categoryId yoksa categoryName ile bilgisini doldur
    if (!req.body.categoryId && req.body.categoryName) {
    const isExists = await Category.findOne({
        name: req.body.categoryName.toLowerCase(),
      });
      if (isExists) {
        req.body.categoryId = (
          await Category.findOne({
            name: req.body.categoryName.toLowerCase(),
          })
        )._id;
      }
    }

    const data = await Activity.create(req.body);

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    const data = await Activity.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
   
    //? admin harici herkes kendi activity' sini güncelleyebilir
    if(!req.user.isAdmin) {
      const userId = (await Activity.findOne({ _id: req.params.id })).userId;
      // console.log(userId);
      // console.log(req.user._id);
      //? toString methodu ile karşılaştırma yapılabiliyor aksi halde objeler karşılaştırılmaz
      // if (userId.toString() !== req.user._id.toString()) {return res.status(403).send({ error: true, message: "Unauthorized" });}
      //? veya
      if (!userId.equals(req.user._id)){
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
     }

    const data = await Activity.updateOne({ _id: req.params.id }, req.body);
    const newdata = await Activity.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      body: req.body,
      data: data, // info about update
      // güncel veriyi istiyorsan tekrar çağır
      newdata: newdata,
    });
  },
  delete: async (req, res) => {
    const data = await Activity.deleteOne({ _id: req.params.id });
    // console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
