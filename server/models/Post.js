const mongoose = require('mongoose');
const Account=require('../models/Account.js');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  text: {
    type: String,
    required: true,
  },
  comments: {
    type: [{
      comment:{
        type: String,
        required: true,
      },
      username:{
        type: String,
        required: true,
      }
    }],
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  username: {
    type: String,
    required: true,
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  text: doc.text,
  comments: doc.comments,
  username: doc.username,
});

PostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  const posts =PostModel.find(search).select('title text comments username');
  return posts.exec(callback);
};
PostSchema.statics.findByTitle = (title, callback) => {
  const search = {
    //owner: convertId(ownerId),
    title,
  };
  return PostModel.find(search).lean().exec(callback);
};

PostSchema.statics.deletePost = (ownerId, title, text, callback) => {
  const search = {
    owner: convertId(ownerId),
    title,
    text,
  };

  return PostModel.find(search).deleteOne({
    title,
    text,
  }, callback);
};

PostSchema.statics.postComment = (postowner,username, title, text, comment, callback) => {
  const search = {
    username: postowner,
    title,
    text,
  };
  PostModel.updateOne(search, { $push: { comments: [{username:username,comment:comment}] } }, callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
