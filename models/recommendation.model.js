const {Schema, model} = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2');
const User = require ('./user.model')

const RecomendationSchema = Schema({
  user: { 
    type: Schema.Types.ObjectId,
    ref: User,
    autopopulate: true
  },
  friend: {
    type: Schema.Types.ObjectId,
    ref: User,
    autopopulate: true
  },
  titleMovie: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  strict: false
})

RecomendationSchema.plugin(mongoosePaginate)
RecomendationSchema.plugin(require('mongoose-autopopulate'));

module.exports = model("recommendation", RecomendationSchema)
