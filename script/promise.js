const lambda = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/season";

const credentials = {"userId": '11046941486', "password": '$noW2425', "date": '2024-11-07T04:17:10.937Z'}

function fetchData() {
    return new Promise( function(resolve, reject) {
        fetch( lambda, { method : "POST", body: JSON.stringify(credentials), headers: { "Content-Type": "application/json" }} )
        .then( response => response.json() )
        .then( data => {
            console.log(data);
        })
    });
}

function progressBar( id, innerText ) {

    var obj = {
        "tag" : "div",
        "class" : ["row"],            
        "children" : [
            {   
                "tag" : "div",
                "class" : "col-4",
                "innerText" : innerText
            },
            {
                "tag": "div",
                "class" : "col-8",
                "children": [
                    {
                        "tag": "div",
                        "id" : id,
                        "class" : ["progress"],
                        "attributes": [
                            { "role" : "progressbar"},
                            { "aria-label" : "Animated striped"},
                            { "aria-valuenow" : "1" },
                            { "aria-valuemin": "0"},
                            { "aria-valuemax": "100"}
                        ],
                        "children" : [
                            {
                                "tag": "div",
                                "class": ["progress-bar","bg-success"],
                                "attributes": [
                                    { "style" : "width: 0%;"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]            
    }

    return builder(obj);
}

