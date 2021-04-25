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
const handleDelete=(e)=>{
    e.preventDefault();
    sendAjax('POST',$(e.target).attr("action"),$(e.target).serialize(),function(){
        loadPostsFromServer();
    });
}

const handleSearch=(e)=>{
    e.preventDefault();
    console.log($(e.target).serialize());
    sendAjax('GET', $(e.target).attr("action"),$(e.target).serialize(), (data)=>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={data.csrf}/>,document.querySelector("#posts"),
        );
    });
}

const handleComment=(e)=>{
    e.preventDefault();
    sendAjax('POST', $(e.target).attr("action"),$(e.target).serialize(), function(){});
    console.log($(e.target).serialize());
    sendAjax('GET',  "/searchPost",$(e.target).serialize(), (data)=>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={data.csrf}/>,document.querySelector("#posts"),
        );
    });
}
const PostForm=(props)=>{
    return(
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
    );
};

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


const PostDelete=function(props,post)
{
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
        <input type="hidden" name="_title" value= {post.title} />
        <input className="commentPost" type="submit" value= "Send"/>
    </form>
    );
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

        // const postComment=post.comments.map(function(comment){
        //     return(
        //         <div className="comment">
        //             {comment}
        //         </div>
        //     );
        // });
        console.log("Post: "+post.comments);
        return(
            <div key={post._id} className="post">
                <h3 className="postTitle">Title: {post.title}</h3>
                <h3 className="postText">Text: {post.text}</h3>
                {PostDelete(props, post)} 
                {PostComment(props,post)}     
                <h3 className="postComments">Comments:</h3>
                <div id={post.title} className="comments">
                    {post.comments}
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
    sendAjax('GET', '/getPosts',null, (data)=>{
        ReactDOM.render(
            <PostList posts={data.posts} csrf={data.csrf}/>,document.querySelector("#posts"),
        );
    });
};

const setup=(csrf)=>{
    ReactDOM.render(
        <PostForm csrf={csrf}/>,document.querySelector("#makePost"),
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
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});