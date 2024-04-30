"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Like Controller:

const Like = require("../models/like");

module.exports = {
  list: async (req, res) => {
    // const data = await Like.find()
    const data = await res.getModelList(Like);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Like),
      data: data,
    });
  },
  create: async (req, res) => {

    //? userId ve itemId alanlarını doldurun
    req.body.userId = req.user._id;
    //  req.body.itemId =  // TODO: itemId alanını doldur

    //? zaten kullanıcı beğendiyse 409 hatası verilir
    const existingLike = await Like.findOne({ userId, itemId });
    if (existingLike) {
      return res.status(409).send({ 
        error: true, 
        message: "Already liked" });
    }

    const data = await Like.create(req.body);

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    const data = await Like.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
    
    //? Admin olmayan herkes kendi like' nı güncelleyebilir.
    if(!req.user.isAdmin) {
     const userId= (await Like.findOne({ _id: req.params.id })).userId;

     //? object id karşılaştırması
     if (!userId.equals(req.user._id)) {
       return res.status(403).send({ error: true, message: "Unauthorized" });
     }
    }

    const data = await Like.updateOne({ _id: req.params.id }, req.body);
    const newdata = await Like.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      body: req.body,
      data: data, // info about update
      // güncel veriyi istiyorsan tekrar çağır
      newdata: newdata,
    });
  },
  delete: async (req, res) => {
    //? Admin olmayan herkes kendi like' nı silebilir
    
    if(!req.user.isAdmin) {
      const userId= (await Like.findOne({ _id: req.params.id })).userId;
      if (userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
     }
    const data = await findByIdAndDelete(req.params.id );
    // console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
