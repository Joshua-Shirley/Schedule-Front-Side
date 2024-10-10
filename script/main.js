async function getData(universalLocationResource) {
    const url = universalLocationResource;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const contentType = response.headers.get("content-type");
        if(!contentType || !contentType.includes("application/json")){
            throw new TypeError("Not a json file");
        }
        data = await response.json();        
    } catch (error) {
        console.error(error.message);
    }
}

Date.prototype.compareDate = function (dateB) {
    if (this.getFullYear() == dateB.getFullYear()) {
        if (this.getMonth() == dateB.getMonth()) {
            if (this.getDate() == dateB.getDate()) {
                return true;
            }
        }
    }
    return false;
};

function findNextEvent(data, date){
    // verify data json
    if( !data instanceof Object) {
        console.error("Not a json object");
    }
    // Test the date parameter that it is type Date
    if( !date instanceof Date ) {
        console.error("Not a date object");
        return false;
    }
    // format the date 
    // set hours, minutes, seconds, and milliseconds to zero
    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    
    // search the json object for the current date.    
    index = 0
    while( !data["2024-2025"].hasOwnProperty(newDate.toISOString()) ) 
    {       
        newDate.setDate( newDate.getDate() + 1)        
        if(index++ == 60){
            console.error("No event scheduled within the next 60 days.")
            break;
        }
    }

    return newDate;
}

function daySchedule(data, date){
    // verify data json
    if( !data instanceof Object) {
        console.error("Not a json object");
    }
    // Test the date parameter that it is type Date
    if( !date instanceof Date ) {
        console.error("Not a date object");
        return false;
    }
    // iso date
    iso = date.toISOString()
    // season
    season = "2024-2025"
    daily = data[season][iso];

    return daily
}

function dailyView(dailyObject) {
    dailyObject.forEach( row => {
        for (const key in daily[0]) {
            console.log(key, daily[0][key]);
          }
    });
}

function eventBlock() {
    obj = {
        "tag" : "div",
        "class" : ["accordion-item"],
        "children" : [
            {
                "tag": "h2",
                "class" : ["accordion-header"],
                "children" : [
                    {
                        "tag":  "button",
                        "class": ["accordion-button"],
                        "attributes" : [
                            { "type" : "button",
                              "data-bs-toggle": "collapse",
                              "data-bs-target" : "#collapseOne",
                              "aria-expanded": "true",
                              "aria-controls": "collapseOne" }
                        ],
                        "children": [
                            {
                                "tag" : "span",
                                "innerText" : "8:45 - 9:00 AM"
                            },
                            {
                                "tag" : "span",
                                "innerText" : "PCY: Available SKI Private"
                            }
                        ]
                    }
                ]
            },
            {
                "tag": "div",
                "id": "collapseOne",
                "class": ["accorion-collapse", "collapse", "show"],
                "attributes" : [
                    { "data-bs-parent": "#accordionExample"}
                ],
                "children": [
                    {
                        "tag": "div",
                        "class": ["accordion-body"],
                        "children": [
                            {
                                "tag": "p",
                                "innerText": "Duration: 0.25 hours"
                            },
                            {
                                "tag": "p",
                                "innerText": "Assignment: Not Checked Out"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    return obj;
}

// Builder() takes a JSON object and creates a new html object
function builder(obj) {
    if (!obj.hasOwnProperty("tag")) { return null; }
    var block = document.createElement(obj["tag"]);
    if (obj.hasOwnProperty("class")) {
        if (Array.isArray(obj["class"])) {
            block.classList.add(...obj["class"]);
        } else {
            block.classList.add(obj["class"]);
        }
    }
    if (obj.hasOwnProperty("attributes")){
        if(Array.isArray(obj["attributes"])){
            obj["attributes"].forEach(child => {                 
                const keys = Object.keys(child);
                keys.forEach( key => {
                    block.setAttribute(key, child[key]);
                });
            });               
        }
    }
    if (obj.hasOwnProperty("id")) {
        block.id = obj["id"];
    }
    if (obj.hasOwnProperty("innerText")) {
        block.innerText = obj["innerText"];
    }
    if (obj.hasOwnProperty("innerHTML")) {
        if (typeof obj["innerHTML"] === "object") {
            block.appendChild(builder(obj["innerHTML"]));
        }
        else {
            block.innerHTML = obj["innerHTML"];
        }
    }
    if (obj.hasOwnProperty("children")) {
        if (Array.isArray(obj["children"])) {
            obj["children"].forEach(child => {
                block.append(builder(child));
            });
        }
        else if (typeof obj["children"] === "object") {
            block.append(builder(obj["children"]));
        }
    }
    return block;
}


const url = "https://instructor-snow-com.s3.us-west-1.amazonaws.com/2024-2025.json";
let data = {};
getData(url)

var blank = new Date()
var today = new Date(blank.getFullYear(), blank.getMonth(), blank.getDate(), 0, 0 , 0, 0);

eventObj = eventBlock()
item = builder(eventObj);

// Fix me

// 1 - Done - python json code alter the start date to an ISO date string
// 2 - Done - add in the end date ISO string
// 3 - DONE - hash id for each event
// 4 - can the guest data be parsed out of the private lessons and moved to its own json file
// 5 - Time to Time