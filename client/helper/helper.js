const handleError=(message)=>{
    $("#errorMessage").text(message);
    $("#postMessage").animate({width:'toggle'},350);
};

const redirect=(response)=>{
    $("#postMessage").animate({width:'hide'},350);
    window.location=response.redirect;
};

const sendAjax=(type,action,data,success,afterRequest,async=true)=>{
    console.log(data);
    $.ajax({
        cache:false,
        type:type,
        url:action,
        data:data,
        dataType:"json",
        success:success,
        async:async,
        error:function(xhr,status,error){
            var messageObj =JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    }).done(afterRequest);
};
