"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *


/* ------------------------------------------------------- */
// view Model:
//? route olmayacak her read işleminden sonra bir view eklenecek

const ViewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      // viewed activity
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity', // Reference to the Activity model
        required: true,
      },
      ipAddress: {
          type: String,
          default: null,                 
      }
     
},{
    timestamps: true,
    collection: 'views',
}
)


/* ------------------------------------------------------- */
module.exports = mongoose.model('View', ViewSchema)