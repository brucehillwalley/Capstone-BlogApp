"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Comment Controller:

const Comment = require("../models/comment");
const Activity = require("../models/activity");

module.exports = {
  list: async (req, res) => {
    let customFilters = {
      isDeleted: false,
    };

    //? admin haricindeki kullanıcılar silinen Comment' ları göremez.
    if (req.user?.isAdmin) {
      customFilters = {};
    }

    const data = await res.getModelList(Comment, customFilters);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment, customFilters),
      data: data,
    });
  },
  create: async (req, res) => {
    //? crate kullanıcının kendi id'si ile olması lazım
    req.body.userId = req.user._id;

    const data = await Comment.create(req.body);

    res.status(201).send({
      error: false,
      body: req.body,
      data: data,
    });
  },
  read: async (req, res) => {

    let customFilters = {
      isDeleted: false,
    };

    //? admin haricindeki kullanıcılar silinen Comment' ı göremez.
    if (req.user?.isAdmin) {
      customFilters = {};
    }
    const data = await Comment.findOne({
      _id: req.params.id,
      ...customFilters,
    });
    res.status(202).send({
      error: false,
      data: data,
    });
  },
  update: async (req, res) => {
    //? admin harici herkes kendi Comment' ini güncelleyebilir
    if (!req.user.isAdmin) {
      const userId = (await Comment.findOne({ _id: req.params.id })).userId;
    
      //? toString methodu ile karşılaştırma yapılabiliyor aksi halde objeler karşılaştırılmaz
      // if (userId.toString() !== req.user._id.toString()) {return res.status(403).send({ error: true, message: "Unauthorized" });}

      //? veya
      if (!userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
    }

    //? ilk önce var olan comment'i allEdits'e all:
    const oldData = await Comment.findOne({ _id: req.params.id });

    //? yorumdaki kod başarısız
    // oldData.allEdits.push(oldData.comment)

    //? başarılı
    let allEdits = oldData.allEdits;
    allEdits.push(oldData.comment);
    oldData.allEdits = allEdits;
    await oldData.save();

    const data = await Comment.updateOne({ _id: req.params.id }, req.body);
    
    const newdata = await Comment.findOne({ _id: req.params.id });
    res.status(202).send({
      error: false,
      body: req.body,
      data: data, // info about update
      // güncel veriyi istiyorsan tekrar çağır
      newdata: newdata,
    });
  },
  delete: async (req, res) => {
    //? Comment zaten silinmiş ise 404 hatası verilir.
    const isAlreadyDeletedComment = (
      await Comment.findOne({ _id: req.params.id })
    ).isDeleted;
    // console.log(isAlreadyDeletedComment);
    if (isAlreadyDeletedComment) {
      return res
        .status(404)
        .send({ error: true, message: "Comment not found" });
    }

    //? admin harici herkes kendi Comment' sini silebilir
    if (!req.user.isAdmin) {
      const userId = (await Comment.findOne({ _id: req.params.id })).userId;

      if (!userId.equals(req.user._id)) {
        return res.status(403).send({ error: true, message: "Unauthorized" });
      }
    }

    const data = await Comment.updateOne(
      { _id: req.params.id },
      {
        isDeleted: true,
        isPublished: false,
        deletedId: req.user._id,
        deletedAt: new Date(),
      }
    );

    //? 404 hatası yukarıda zaten silinmiş ise
    res.sendStatus(204);
  },

  //? silinmiş Comment' lari listelemek için kullanılır.
  listDeleted: async (req, res) => {
    /*
    #swagger.tags = ["Comment"]
    #swagger.summary = "Get Deleted Comment"
    #swagger.description = `
     You can send query with endpoint for filter[], search[], sort[], page and limit.
                    <ul> Examples:
                        <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                        <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                        <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                        <li>URL/?<b>page=2&limit=1</b></li>
                    </ul>
    
    `
   */
    //? admin haricindeki kullanıcılar silinen Comment' ları göremez.
    //? permission kontrolu: route' da isAdmin

    let customFilter = { isDeleted: true };
    const data = await res.getModelList(Comment, customFilter, [
      { path: "deletedId", select: "username firstName lastName" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment, customFilter),
      data,
    });
  },
};
