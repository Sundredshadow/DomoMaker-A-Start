"use strict";

var handlePost = function handlePost(e) {
  e.preventDefault();
  $("#postMessage").animate({
    width: 'hide'
  }, 350);

  if ($('#postTitle').val() == '' || $("#postText").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    loadPostsFromServer();
  });
  return false;
};

var handleGetPosts = function handleGetPosts(e) {
  e.preventDefault(); //console.log($(e.target).serialize());

  sendAjax($(e.target).attr("method"), $(e.target).attr("action"), $(e.target).serialize(), function () {
    loadPostsFromServer();
  });
};

var handleSignup = function handleSignup(e) {
  e.preventDefault(); //console.log($(e.target).serialize());

  sendAjax($(e.target).attr("method"), $(e.target).attr("action"), $(e.target).serialize(), function () {
    getToken();
  });
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {
    loadPostsFromServer();
  });
};

var handleSearch = function handleSearch(e) {
  e.preventDefault(); //console.log($(e.target).serialize());

  sendAjax('GET', $(e.target).attr("action"), $(e.target).serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts,
      csrf: data.csrf
    }), document.querySelector("#posts"));
  });
};

var handleComment = function handleComment(e) {
  e.preventDefault();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {}); //console.log($(e.target).serialize());

  sendAjax('GET', "/searchPost", $(e.target).serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts,
      csrf: data.csrf
    }), document.querySelector("#posts"));
  });
};

var PostForm = function PostForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "titleBar"
  }, /*#__PURE__*/React.createElement("form", {
    id: "postForm",
    onSubmit: handlePost,
    action: "/maker",
    method: "POST",
    className: "postForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "postName",
    type: "text",
    name: "title",
    placeholder: "Post Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Text: "), /*#__PURE__*/React.createElement("input", {
    id: "postName",
    type: "text",
    name: "text",
    placeholder: "Post Name"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makePostSubmit",
    type: "submit",
    value: "Make Post"
  })), MyPosts(props), Subscribe(props));
};

var MyPosts = function MyPosts(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "myPosts",
    onSubmit: handleGetPosts,
    action: "/getPosts",
    method: "GET",
    className: "myPostsForm"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "myPostsSubmit",
    type: "submit",
    value: "My Posts"
  }));
};

var PostSearch = function PostSearch(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchPost",
    onSubmit: handleSearch,
    action: "/searchPost",
    method: "GET",
    className: "postSearch"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Search: "), /*#__PURE__*/React.createElement("input", {
    id: "searchQuery",
    type: "text",
    name: "_title",
    placeholder: "search"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "searchSubmit",
    type: "submit",
    value: "Search"
  }));
};

var Subscribe = function Subscribe(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "subscribeForm",
    onSubmit: handleSignup,
    action: "/subscribe",
    method: "POST",
    className: "subscribe"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "username",
    value: props.username
  }), /*#__PURE__*/React.createElement("input", {
    className: "searchSubmit",
    type: "submit",
    value: "Subscribe"
  }));
};

var PostDelete = function PostDelete(props, post) {
  if (props.username !== post.username) {
    return;
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "delPost",
    onSubmit: handleDelete,
    action: "/delPost",
    method: "POST",
    className: "delPost"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_title",
    value: post.title
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_text",
    value: post.text
  }), /*#__PURE__*/React.createElement("input", {
    className: "deletePost",
    type: "submit",
    value: "X"
  }));
};

var PostComment = function PostComment(props, post) {
  return /*#__PURE__*/React.createElement("form", {
    id: "commentPost",
    onSubmit: handleComment,
    action: "/commentPost",
    method: "POST",
    className: "commentPost"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Comment: "), /*#__PURE__*/React.createElement("input", {
    id: "postName",
    type: "text",
    name: "_comment",
    placeholder: "comment"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_text",
    value: post.text
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_postowner",
    value: post.username
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_title",
    value: post.title
  }), /*#__PURE__*/React.createElement("input", {
    className: "commentPost",
    type: "submit",
    value: "Send"
  }));
};

var getProfileInfo = function getProfileInfo(username, callback) {
  sendAjax("GET", "/subscribe", "username=" + username, callback);
};

var PostList = function PostList(props) {
  if (props.posts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "postList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPost"
    }, "No Posts yet"));
  }

  var postNodes = props.posts.map(function (post) {
    var postComments = post.comments.map(function (commentBlock, index) {
      return /*#__PURE__*/React.createElement("li", {
        key: index
      }, /*#__PURE__*/React.createElement("h5", {
        className: "postComment"
      }, "Username: ", commentBlock.username), /*#__PURE__*/React.createElement("h5", {
        className: "postComment"
      }, "Comment: ", commentBlock.comment));
    });
    return /*#__PURE__*/React.createElement("div", {
      key: post._id,
      className: "post"
    }, /*#__PURE__*/React.createElement("div", {
      className: "postTitle"
    }, /*#__PURE__*/React.createElement("div", {
      className: "profile",
      id: post._id
    }, /*#__PURE__*/React.createElement("h5", {
      className: "pUsername"
    }, post.username), /*#__PURE__*/React.createElement("img", {
      className: "profileImg",
      src: "/assets/img/Sample_User_Icon.png",
      alt: "base profile img"
    })), /*#__PURE__*/React.createElement("h2", {
      className: "pTitle"
    }, post.title), PostDelete(props, post)), /*#__PURE__*/React.createElement("div", {
      className: "postText"
    }, post.text), /*#__PURE__*/React.createElement("div", {
      className: "comments"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "postComments"
    }, "Comments:"), PostComment(props, post), /*#__PURE__*/React.createElement("ul", {
      className: "commentsList"
    }, postComments)));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "postList"
  }, postNodes);
};

var loadPostsFromServer = function loadPostsFromServer() {
  var load = function load() {
    return new Promise(function (resolve, reject) {
      sendAjax('GET', '/getPosts', null, function (data) {
        ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
          posts: data.posts,
          username: data.username,
          csrf: data.csrf
        }), document.querySelector("#posts"));
        resolve(data);
      });
    });
  };

  load();
};

var setup = function setup(csrf, username) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PostForm, {
    csrf: csrf,
    username: username
  }), document.querySelector("#makePost"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostSearch, {
    csrf: csrf
  }), document.querySelector("#searchPost"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
    posts: [],
    csrf: csrf,
    username: username
  }), document.querySelector("#posts"));
  loadPostsFromServer();
  getProfileInfo(username, function (data) {
    if (data.subData.subscribed === true) {
      ReactDOM.render( /*#__PURE__*/React.createElement("div", {
        id: "innerTopProfile"
      }, /*#__PURE__*/React.createElement("h2", {
        id: "toppUsername",
        className: "pUsername"
      }, username), /*#__PURE__*/React.createElement("img", {
        id: "topprofileImg",
        className: "profileImg",
        src: "/assets/img/gold-icon.jpg",
        alt: "base profile img"
      })), document.querySelector("#topProfile"));
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement("div", {
        id: "innerTopProfile"
      }, /*#__PURE__*/React.createElement("h2", {
        id: "toppUsername",
        className: "pUsername"
      }, username), /*#__PURE__*/React.createElement("img", {
        id: "topprofileImg",
        className: "profileImg",
        src: "/assets/img/Sample_User_Icon.png",
        alt: "base profile img"
      })), document.querySelector("#topProfile"));
    }
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken, result.username);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#postMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#postMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success, afterRequest) {
  var async = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    async: async,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  }).done(afterRequest);
};
