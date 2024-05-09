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
    /*
      #swagger.tags = ["Like"]
      #swagger.summary = "List Likes"
      #swagger.description = `You can send query with endpoint for filter[], search[], sort[], page and limit.
      <ul> Examples:
          <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
          <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
          <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
          <li>URL/?<b>page=2&limit=1</b></li>
      </ul>
      `
    */
    // const data = await Like.find()
    const data = await res.getModelList(Like);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Like),
      data: data,
    });
  },
  create: async (req, res) => {
    /*
      #swagger.tags = ["Like"]
      #swagger.summary = "Create Like"
      #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            $ref: "#/definitions/Like"
        }
      }
    */

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
      await Activity.updateOne({ _id: req.body.itemId }, { $inc: { likeCount: 1 }, $push: { likes: req.user._id } });
    }else if(req.body.itemType === "comment") {
      await Comment.updateOne({ _id: req.body.itemId }, { $inc: { likeCount: 1 }, $push: { likes: req.user._id } });
    }

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Like"]
      #swagger.summary = "Get Single Like"
    */
    const data = await Like.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Like"]
      #swagger.summary = "Update Like"
      #swagger.parameters['body'] = {
        
        in: 'body',
        required: true,
        schema: {
            $ref: '#/definitions/Like',
        }
      }
    */
    
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
    /*
      #swagger.tags = ["Like"]
      #swagger.summary = "Delete Like"
    */
    
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
        await Activity.updateOne({ _id: likeData.itemId }, { $inc: { likeCount: -1 }, $pull: { likes: req.user._id } });
      }else if(likeData.itemType === "comment") {
        await Comment.updateOne({ _id: likeData.itemId }, { $inc: { likeCount: -1 }, $pull: { likes: req.user._id } });
      }
    console.log(data);
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
