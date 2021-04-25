const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CommentSchema=new mongoose.Schema({
  comment:{
    type:String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

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
  comments:{
    type: [String],
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
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
});

PostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PostModel.find(search).select('title text comments').lean().exec(callback);
};
PostSchema.statics.findByTitle = ( title, callback) => {
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

PostSchema.statics.postComment=(ownerId, title, text,comment,callback)=>{
    const search={
      //owner: convertId(ownerId),
      title,
      text,
    }
    PostModel.updateOne(search,{$push:{comments:[comment]}},callback);
}

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
