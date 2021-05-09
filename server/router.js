const controllers = require('./controllers');
const mid = require('./middleware');
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/subscribe', mid.requiresLogin, controllers.Account.subscribeToSite);
  app.get('/subscribe', mid.requiresLogin, controllers.Account.getSubInfo)
  app.post('/maker', mid.requiresLogin, controllers.Post.make);
  app.post('/delPost', mid.requiresLogin, controllers.Post.delPost);
  app.get('/searchPost', mid.requiresLogin, controllers.Post.searchPost);
  app.post('/commentPost', mid.requiresLogin, controllers.Post.commentPost);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};
module.exports = router;
