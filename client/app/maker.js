const handleDomo=(e)=>{
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($('#domoName').val()==''||$("#domoAge").val()==''||$("#domoLevel").val()==''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST',$("#domoForm").attr("action"),$("#domoForm").serialize(),function(){
        loadDomosFromServer();
    });

    return false;
};
const handleDelete=(e)=>{
    e.preventDefault();
    console.log(e.target);
    sendAjax('POST',$(e.target).attr("action"),$(e.target).serialize(),function(){
        loadDomosFromServer();
    });
}

const DomoForm=(props)=>{
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value= "Make Domo"/>
        </form>
    );
};

const domoDelete=function(props,domo)
{
    return(
    <form id="delDomo" 
    onSubmit={handleDelete}
    action="/delDomo"
    method="POST"
    className="delDomo">
        <input type="hidden" name="_csrf" value= {props.csrf} />
        <input type="hidden" name="_name" value= {domo.name} />
        <input type="hidden" name="_age" value= {domo.age} />
        <input type="hidden" name="_level" value= {domo.level} />
        <input className="deleteDomo" type="submit" value= "X"/>
    </form>
    );
}

const DomoList=function(props){
    if(props.domos.length===0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    const domoNodes =props.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3> 
                {domoDelete(props, domo)}      
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer=()=>{
    sendAjax('GET', '/getDomos',null, (data)=>{
        console.log(data);
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={data.csrf}/>,document.querySelector("#domos"),
        );
    });
};

const setup=(csrf)=>{
    ReactDOM.render(
        <DomoForm csrf={csrf}/>,document.querySelector("#makeDomo"),
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf}/>,document.querySelector("#domos"),
    );
    loadDomosFromServer(csrf);
}

const getToken=()=>{
    sendAjax('GET','/getToken',null,(result)=>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});