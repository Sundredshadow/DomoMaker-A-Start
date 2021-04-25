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

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {
    loadPostsFromServer();
  });
};

var handleSearch = function handleSearch(e) {
  e.preventDefault();
  console.log($(e.target).serialize());
  sendAjax('GET', $(e.target).attr("action"), $(e.target).serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts,
      csrf: data.csrf
    }), document.querySelector("#posts"));
  });
};

var handleComment = function handleComment(e) {
  e.preventDefault();
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {});
  console.log($(e.target).serialize());
  sendAjax('GET', "/searchPost", $(e.target).serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts,
      csrf: data.csrf
    }), document.querySelector("#posts"));
  });
};

var PostForm = function PostForm(props) {
  return /*#__PURE__*/React.createElement("form", {
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

var PostDelete = function PostDelete(props, post) {
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
    name: "_title",
    value: post.title
  }), /*#__PURE__*/React.createElement("input", {
    className: "commentPost",
    type: "submit",
    value: "Send"
  }));
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
    // const postComment=post.comments.map(function(comment){
    //     return(
    //         <div className="comment">
    //             {comment}
    //         </div>
    //     );
    // });
    console.log("Post: " + post.comments);
    return /*#__PURE__*/React.createElement("div", {
      key: post._id,
      className: "post"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "postTitle"
    }, "Title: ", post.title), /*#__PURE__*/React.createElement("h3", {
      className: "postText"
    }, "Text: ", post.text), PostDelete(props, post), PostComment(props, post), /*#__PURE__*/React.createElement("h3", {
      className: "postComments"
    }, "Comments:"), /*#__PURE__*/React.createElement("div", {
      id: post.title,
      className: "comments"
    }, post.comments));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "postList"
  }, postNodes);
};

var loadPostsFromServer = function loadPostsFromServer() {
  sendAjax('GET', '/getPosts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts,
      csrf: data.csrf
    }), document.querySelector("#posts"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PostForm, {
    csrf: csrf
  }), document.querySelector("#makePost"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostSearch, {
    csrf: csrf
  }), document.querySelector("#searchPost"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
    posts: [],
    csrf: csrf
  }), document.querySelector("#posts"));
  loadPostsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
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

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
