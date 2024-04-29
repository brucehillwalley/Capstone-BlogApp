"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// Activity Controller:

const Activity = require("../models/activity");
const mongoose = require("mongoose");

module.exports = {
  list: async (req, res) => {
   

    const customFilters = {
      isPublished: true,
      isDeleted: false,
    };

    if (req.user?.isAdmin) {
      customFilters={}
    }

    const data = await res.getModelList(Activity, customFilters);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Activity, customFilters),
      data: data,
    });
  },
  create: async (req, res) => {
    let data;

    //? parent Activity control:
    if (req.body?.parentActivityIds) {
      for (const parentActivityId of req.body.parentActivityIds) {
        const parentActivity = Activity.findOne({ _id: parentActivityId });
        if (!parentActivity) {
          return res.status(400).send({
            error: true,
            message: "Parent Activity not found",
          });
        }
      }

      data = await Activity.create(req.body);
      parentActivity.subActivityIds.push(data._id);
      await parentActivity.save();
    }

    //? subActivity control:
    if (req.body?.subActivityIds) {
      for (const subActivityId of req.body.subActivityIds) {
        const subActivity = Activity.findOne({ _id: subActivityId });
        if (!subActivity) {
          return res.status(400).send({
            error: true,
            message: "Sub Activity not found",
          });
        }
      }
      data = await Activity.create(req.body);
      subActivity.parentActivityIds.push(data._id);
      await subActivity.save();
    }

    if (!req.body?.subActivityIds && !req.body?.parentActivityIds) {
      data = await Activity.create(req.body);
    }

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
    //? permission isAdmin => router da

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
