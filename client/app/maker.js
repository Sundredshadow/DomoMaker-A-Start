const handlePost=(e)=>{
    e.preventDefault();

    $("#postMessage").animate({width:'hide'},350);

    if($('#postTitle').val()==''||$("#postText").val()==''){
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST',$("#postForm").attr("action"),$("#postForm").serialize(),function(){
        loadPostsFromServer();
    });

    return false;
};

const handleGetPosts=(e)=>{
    e.preventDefault();
    //console.log($(e.target).serialize());
    sendAjax($(e.target).attr("method"),$(e.target).attr("action"),$(e.target).serialize(),function(){
        loadPostsFromServer();
    });
}

const handleDelete=(e)=>{
    e.preventDefault();
    sendAjax('POST',$(e.target).attr("action"),$(e.target).serialize(),function(){
        loadPostsFromServer();
    });
}

const handleSearch=(e)=>{
    e.preventDefault();
    //console.log($(e.target).serialize());
    sendAjax('GET', $(e.target).attr("action"),$(e.target).serialize(), (data)=>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={data.csrf}/>,document.querySelector("#posts"),
        );
    });
}

const handleComment=(e)=>{
    e.preventDefault();
    sendAjax('POST', $(e.target).attr("action"),$(e.target).serialize(), function(){});
    //console.log($(e.target).serialize());
    sendAjax('GET',  "/searchPost",$(e.target).serialize(), (data)=>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={data.csrf}/>,document.querySelector("#posts"),
        );
    });
}

const PostForm=(props)=>{
    return(
        <div className="titleBar">
        <form id="postForm"
            onSubmit={handlePost}
            action="/maker"
            method="POST"
            className="postForm"
        >
            <label htmlFor="name">Title: </label>
            <input id="postName" type="text" name="title" placeholder="Post Name"/>
            <label htmlFor="name">Text: </label>
            <input id="postName" type="text" name="text" placeholder="Post Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makePostSubmit" type="submit" value= "Make Post"/>
        </form>
        {MyPosts(props)}
        {Subscribe(props)}
        </div>
    );
};

const MyPosts=(props)=>{
    return(
        <form id="myPosts"
            onSubmit={handleGetPosts}
            action="/getPosts"
            method="GET"
            className="myPostsForm"
        >
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="myPostsSubmit" type="submit" value= "My Posts"/>
        </form>
    );
}

const PostSearch=(props)=>{
    return( 
        <form id="searchPost"
          onSubmit={handleSearch}
          action="/searchPost"
          method="GET"
          className="postSearch"
        >
            <label htmlFor="name">Search: </label>
            <input id="searchQuery" type="text" name="_title" placeholder="search"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="searchSubmit" type="submit" value= "Search"/>
        </form>
    );
};

const Subscribe=function(props){
    return( 
        <form id="subscribeForm"
          onSubmit={handleGetPosts}
          action="/subscribe"
          method="POST"
          className="subscribe"
        >
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="username" value={props.username}/>
            <input className="searchSubmit" type="submit" value= "Subscribe"/>
        </form>
    );
}

const PostDelete=function(props,post)
{
    if(props.username!==post.username)
    {
        return;
    }
    return(
    <form id="delPost" 
    onSubmit={handleDelete}
    action="/delPost"
    method="POST"
    className="delPost">
        <input type="hidden" name="_csrf" value= {props.csrf} />
        <input type="hidden" name="_title" value= {post.title} />
        <input type="hidden" name="_text" value= {post.text} />
        <input className="deletePost" type="submit" value= "X"/>
    </form>
    );
    
}

const PostComment=function(props,post)
{
    return(
    <form id="commentPost" 
    onSubmit={handleComment}
    action="/commentPost"
    method="POST"
    className="commentPost">
        <label htmlFor="name">Comment: </label>
        <input id="postName" type="text" name="_comment" placeholder="comment"/>
        <input type="hidden" name="_csrf" value= {props.csrf} />
        <input type="hidden" name="_text" value= {post.text} />
        <input type="hidden" name="_postowner" value= {post.username} />
        <input type="hidden" name="_title" value= {post.title} />
        <input className="commentPost" type="submit" value= "Send"/>
    </form>
    );
}
const getProfileInfo=function(post, callback){
    new Promise((resolve,reject)=>{
        sendAjax("GET","/subscribe","username="+post.username,callback, false);
    });
    
}
const PostList=function(props){
    if(props.posts.length===0){
        return(
            <div className="postList">
                <h3 className="emptyPost">No Posts yet</h3>
            </div>
        );
    }
    const postNodes =props.posts.map(function(post){
        const postComments=post.comments.map(function(commentBlock,index)
        {
            return(
                <li key={index}>
                    <h5 className="postComment">Username: {commentBlock.username}</h5>
                    <h5 className="postComment">Comment: {commentBlock.comment}</h5> 
                </li>
            );
        });
        getProfileInfo(post,(data)=>{
            if(data.subData.subscribed===true){
    
                img="/assets/img/Sample_User_Icon.png"; 
            }
            else{     
                img="";
            }
        });
        return(
            <div key={post._id} className="post">
                <div className="postTitle">
                <div className="profile" id={post._id}>
                    <h5 className="pUsername">{post.username}</h5>
                    <img className="profileImg" src="/assets/img/Sample_User_Icon.png" alt="base profile img"/>
                </div>
                <h2 className="pTitle">{post.title}</h2>
                {PostDelete(props, post)} 
                </div>
                <div className="postText">{post.text}</div> 
                <div className="comments">
                <h3 className="postComments">Comments:</h3>
                {PostComment(props,post)}    
                    <ul className="commentsList">
                        {postComments}
                    </ul>
                </div>
            </div>
        );
    });


    return(
        <div className="postList">
            {postNodes}
        </div>
    );
}

const loadPostsFromServer=()=>{

    const load=function(){
        return new Promise((resolve,reject)=>{
            sendAjax('GET', '/getPosts',null, (data)=>{
                ReactDOM.render(
                    <PostList posts={data.posts} username={data.username} csrf={data.csrf}/>,document.querySelector("#posts"),
                );
                resolve(data);
            });
        })
    }
    
    load()
};

const setup=(csrf,username)=>{
    ReactDOM.render(
        <PostForm csrf={csrf} username={username}/>,document.querySelector("#makePost"),
    );

    ReactDOM.render(
        <PostSearch csrf={csrf}/>,document.querySelector("#searchPost"),
    );

    ReactDOM.render(
        <PostList posts={[]} csrf={csrf}/>,document.querySelector("#posts"),
    );
    loadPostsFromServer(csrf);
}

const getToken=()=>{
    sendAjax('GET','/getToken',null,(result)=>{
        setup(result.csrfToken, result.username);
    });
};

$(document).ready(function(){
    getToken();
});