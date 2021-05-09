const models = require('../models');

const { Post } = models;

const makerPage = (req, res) => {
  Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
  });
};

const makePost = (req, res) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({ error: 'RAWR! Both title and text are required' });
  }

  const postData = {
    title: req.body.title,
    text: req.body.text,
    owner: req.session.account._id,
    username: req.session.account.username,
  };
  const newPost = new Post.PostModel(postData);

  const postPromise = newPost.save();

  postPromise.then(() => res.json({ redirect: '/maker' }));

  postPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists.' });
    }
    return res.status(400).json({ error: 'An error ocurred' });
  });
  return postPromise;
};

const delPost = (req, res) => Post.PostModel.deletePost(req.session.account._id,
  req.body._title, req.body._text, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ redirect: '/maker' });
  });

const getPosts = (request, response) => {
  const req = request;
  const res = response;

  return Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ posts: docs, username: req.session.account.username, csrf: req.csrfToken() });
  });
};

const searchPost = (req, res) => Post.PostModel.findByTitle(req.query._title, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.json({ posts: docs, csrf: req.csrfToken() });
});

const commentPost = (req, res) => {
  // not returning anything merely updating
  Post.PostModel.postComment(req.body._postowner, req.session.account.username, req.body._title,
    req.body._text, req.body._comment, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred comment' });
      }
      return {};
    });
};
module.exports.makerPage = makerPage;
module.exports.getPosts = getPosts;
module.exports.make = makePost;
module.exports.delPost = delPost;
module.exports.searchPost = searchPost;
module.exports.commentPost = commentPost;
