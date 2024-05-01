"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Like Controller:

const Like = require("../models/like");
const Activity = require("../models/activity");
const Comment = require("../models/comment");

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
    const existingLike = await Like.findOne({userId: req.body.userId, itemId: req.body.itemId});
    if (existingLike) {
      return res.status(409).send({ 
        error: true, 
        message: "Already liked" });
    }

    const data = await Like.create(req.body);
    //? activity veya comment için likeCount'u arttırın
    if(req.body.itemType === "activity") {
      await Activity.updateOne({ _id: req.body.itemId }, { $inc: { likeCount: 1 } });
    }else if(req.body.itemType === "comment") {
      await Comment.updateOne({ _id: req.body.itemId }, { $inc: { likeCount: 1 } });
    }

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
    
    //? Admin olmayan herkes sadece kendi like' nı güncelleyebilir.
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
      if (!userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
     }
     const likeData = await Like.findOne({ _id: req.params.id });
    const data = await Like.deleteOne({_id:req.params.id} );
      //? activity veya comment için likeCount'u azalt:
      if(likeData.itemType === "activity") {
        await Activity.updateOne({ _id: likeData.itemId }, { $inc: { likeCount: -1 } });
      }else if(likeData.itemType === "comment") {
        await Comment.updateOne({ _id: likeData.itemId }, { $inc: { likeCount: -1 } });
      }
    console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
