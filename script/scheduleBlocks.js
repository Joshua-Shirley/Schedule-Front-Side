class Blocks {
    constructor(data, date) {

        // accordion settings
        this.accordionId = "scheduleAccordion";
        this.container = document.querySelector("#content");

        // set the parameter arguments
        this.date = date;       
        try {
            this.season = data;
        }
        catch (error){
            if( error instanceof ReferenceError ) {
                console.error("reference error");
            }
            else if (error instanceof TypeError) {
                console.error("type error")
            }
            else {
                console.error("data object is invalid", error);
            }
            return;
        }
        // get the target date value        
        this.daily = data;
        
        // if daily is undefined then throw blankDay 
        if (this.daily == null) {            
            this.blankDay();
        } else {            
            this.scheduledDay();          
        }
    }
    clearContainer() {
        this.container.innerHTML = "";
    }
    loadContainer(obj) {
        this.clearContainer();

        var badge = {
            "tag": "span",
            "id": "updatingBadge",
            "class": ["badge","text-bg-danger", "float-end", "invisible"],
            "innerText": "Updating Data"
        }

        var header = {
            "tag" : "h3",
            "class" : ["pb-3"],
            "innerText" : this.date.toLocaleDateString("default", { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" }),
            "children": [
                badge
            ]
        }

        this.container.append(builder(header));
        this.container.append(builder(obj));
    }
    blankDay() {
        var array = [
            {
                "id": "blankDay",
                "targetId": "collapseOne",
                "timeSpan": "8:30 AM - 4:00 PM",
                "activity" : "Off (Regular Day Off)",
                "assignment": "Nothing scheduled.",
                "hours": "11",
                "notes" : false
            }
        ]

        var accordion = this.accordion(array);

        this.loadContainer(accordion);
    }
    scheduledDay() {
        // daily object needs to include
        // - target id
        // - time span of the start and end dates

        this.daily.forEach( obj => {
            obj["targetId"] = "collapse" + obj.hashId.toString().substring(4,12);
            obj["timeSpan"] = this.timeSpan(obj["start date"], obj["end date"]);
        });

        var accordion = this.accordion(this.daily);
        this.loadContainer(accordion);
    }
    timeSpan(startDate, endDate) {
        const options = { hour : "numeric", minutes : "numeric" }
        // convert the strings to datetime objects
        const start = (new Date(startDate)).toLocaleTimeString("default", { hour : "numeric", minute : "numeric" });
        const end = (new Date(endDate)).toLocaleTimeString("default", { hour : "numeric", minute : "numeric" });
        return start + ' - ' + end;
    }
    accordion(dailyObject) {
        var accordion = {
            "tag": "div",
            "class": ["accordion", "accordion-flush"],
            "id": this.accordionId,
            "children": [
                // accordion items
                // -    accordion header
                // -    acorrdion body
            ]
        }
        // iterate through the possible schedule items and add those to the block.   
        dailyObject.forEach(scheduleEvent => {
            accordion.children.push(this.accordionItem(scheduleEvent));
        });

        return accordion;
    }
    accordionItem(obj) {
        var targetId = "collapseOne";
        var item = {
            "tag": "div",
            "class": ["accordion-item", "mb-4"],
            //"id": obj.id,
            "children": [
                // Header                                
                // Div - Collapse container                                   
            ]
        }
        item.children.push(this.accordionHeader(obj));
        item.children.push(this.accordionCollapse(obj));
        return item;
    }
    accordionHeader(obj) {
        // obj requirements
        // 1. obj.targetId
        // 2. obj.timespan
        // 3. obj.assignment
        var button = {
            "tag": "h2",
            "class": ["accordion-header"],
            "children": [{
                "tag": "button",
                "class": ["accordion-button", "collapsed"],
                "attributes": [
                    {
                        "type": "button",
                        "data-bs-toggle": "collapse",
                        "data-bs-target": "#" + obj.targetId,
                        "aria-expanded": "true",
                        "aria-controls": obj.targetId
                    }
                ],
                "children": [
                    {
                        "tag": "div",
                        "class": ["d-flex", "justify-content-between"],
                        "attributes": [
                            { "style": "width:100%;" }
                        ],
                        "children": [
                            {
                                "tag": "div",
                                "class": ["col", "text-start", "duration"],
                                "attributes": [
                                    { "data-type": "start-end" }
                                ],
                                "innerText": obj.timeSpan
                            },
                            {
                                "tag": "div",
                                "class": ["col", "text-end", "assignment"],
                                "attributes": [
                                    { "data-type": "assignment" }
                                ],
                                "innerText": obj.assignment
                            }
                        ]
                    }
                ]
            }]
        }
        return button;
    }
    accordionCollapse(obj) {
        var collapseBlock = {
            "tag": "div",
            "id": obj.targetId,
            "class": ["accordion-collapse", "collapse", "show"],
            "attributes": [
                //{ "data-bs-parent": "#" + this.accordionId }
            ],
            "children": [
                {
                    "tag": "div",
                    "class": ["accordion-body"],
                    "children" : [
                        {
                            "tag" : "h3",
                            "innerText" : obj.activity
                        },
                        {
                            "tag" : "p",
                            "attributes" : [
                                {"data-type": "hours"}
                            ],
                            "innerText" : "Duration: " + obj.hours + " hours"
                        }
                    ]
                }
            ]
        }

        if (!obj.hasOwnProperty("notes")) {
            var guestTable = this.guestBlock(obj);
            if (guestTable != null) {
                collapseBlock.children[0].children.push(guestTable);
            }
            var adminTable = this.administrativeBlock(obj);
            if (adminTable != null) {
                collapseBlock.children[0].children.push(adminTable);
            }                       
        }

        return collapseBlock;
    }
    guestBlock(obj) {
        const guestKeys = ["client name", "guest name", "lesson comments", "skill level","reservation id", "city, state", "start location"]
        const rows = this.dataTable(obj, guestKeys, "guestNotes");

        // if rows is empty then return null        
        if (rows == null) {
            //console.log("no guest information.");
            return null;
        }

        // create a unique id for the collapse js calls
        var collapseId = "guest" + obj.hashId.toString().substring(4,12);
        var link = {
            "tag" : "link",
            "class" : ["btn", "btn-link"],
            "attributes" : [
                { "data-bs-toggle" : "collapse" },
                { "href" : "#" + collapseId },
                { "role" : "button" },
                { "aria-expanded" : "true" },
                { "aria-controls" : "collapse" },                
            ],
            "innerText" : "Guest Notes"
        }

        var tableHolder = {
            "tag" : "div",
            "class" : ["collapse", "show"],
            "id" : collapseId,
            "children" : [
                {
                    "tag" : "div",
                    "class" : ["card", "card-body"],
                    // insert the table here  
                    "children" : rows
                }
            ]
        }
        
        var div = {
            "tag" : "div",
            "children" : []
        }
        div.children.push(link);
        div.children.push(tableHolder);
        
        return div;
    }
    administrativeBlock(obj) {
        // look for these object keys
        const adminKeys = ["lesson level", "total students", "work hours", "request hours", "benefit hours", "operator id", "schedule comments"]
        const table = this.dataTable(obj, adminKeys, "adminTable");

        // if rows is empty then return null        
        if (table == null) {
            console.log("no administrative information.");
            return [];
        }       

        // create a unique id for the collapse js calls
        var collapseId = "admin" + obj.hashId.toString().substring(4,12);
        var link = {
            "tag" : "link",
            "class" : ["btn", "btn-link"],
            "attributes" : [
                { "data-bs-toggle" : "collapse" },
                { "href" : "#" + collapseId },
                { "role" : "button" },
                { "aria-expanded" : "false" },
                { "aria-controls" : "collapse" },                
            ],
            "innerText" : "Administrative Details"
        }

        var tableHolder = {
            "tag" : "div",
            "class" : ["collapse"],
            "id" : collapseId,
            "children" : [
                {
                    "tag" : "div",
                    "class" : ["card", "card-body"],
                    "children" : table
                }
            ]
        }
        var div = {
            "tag" : "div",
            "children" : []
        }
        div.children.push(link);
        div.children.push(tableHolder);
        return div;        
    }
    dataTable(obj, keys, className) {
        function guestLink(value) {
            const param = new URLSearchParams();
            param.append("name", value);
            var link = {
                "tag" : "a",
                "attributes" : [
                    {"href" : "guests.html?" + param.toString()}
                ],
                "innerText": value
            }
            return link;
        }

        function rowObj(key, value) {
            var row = {
                "tag" : "tr",
                "children" : [
                    {
                        "tag" : "th",
                        "innerText" : key
                    },
                    {
                        "tag" : "td",
                        "attributes" : [
                            { "data-key" : key }
                        ]                        
                    }
                ]
            } 
            if (key == "Client Name") {
                row.children[1].children = [ guestLink(value) ];
            } else {
                row.children[1].innerText = value;
            }
            return row;          
        }    
        
        const rows = [];

        if ( keys instanceof Array) {
            keys.forEach( key => {
                if (obj.hasOwnProperty(key)) {            
                    rows.push( rowObj( key.toProperCase() , obj[key] ) );
                }
            });
        }
        
        if (rows.length == 0) {
            return null;
        }

        var table = {
            "tag" : "table",
            "class" : ["table", className],
            "children" : [
                {
                    "tag" : "tbody",
                    // add the table data rows
                    "children" : rows
                }
            ]
        }
        return table;
    }
}