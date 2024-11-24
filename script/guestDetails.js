class Accordion {
    constructor(lessons) {
        this.lessons = lessons;
        this.accordionId = "lessons";

        this.object = this.container();
    }

    container() {
        var div = {
            "tag" : "div",
            "class" : ["accordion", "accordion-flush"],
            "id" : this.accordionId,
            "children" : this.lessonIterate()
        }
        return div;
    }

    built() {
        return builder(this.obj);
    }

    sort() {
        this.lessons = this.lessons.sort((a,b) => new Date(b["start date"]) - new Date(a["start date"]) );
        // this.lessons = this.lessons.sort((a,b) => new Date(a["start date"]).getMonth() - new Date(b["start date"]).getMonth() );
        // this.lessons = this.lessons.sort((a,b) => new Date(b["start date"]).getFullYear() - new Date(a["start date"]).getFullYear() );
    }

    lessonIterate() {
        this.sort();
        var arr = [];
        this.lessons.forEach( lesson => {
            arr.push( this.item(lesson) )
        });
        return arr;
    }

    item(lesson) {
        
        var head = this.header(lesson);

        var id = "lesson" + Math.abs(lesson.hashId);

        var itemObj = {
            "tag" : "div",
            "class" : ["accordion-item"],
            "children" : [ this.button( id, head ) , this.itemBody( id, lesson ) ]
        }
        return itemObj;
    }

    header(lesson) {

        function cell(innerText, cls) {
            var classArray = ["col"];
            if ( cls instanceof Array ) {
                classArray.concat(cls);
            } else {
                classArray.push( cls );
            }
            var c = {
                "tag": "div",
                "class": classArray,
                "innerText" : innerText
            }
            return c;
        }

        var startDate = new Date( lesson["start date"] );

        var head = {
            "tag" : "div", 
            "class" : ["row"],
            "children" : [ 
                  cell(startDate.toLocaleDateString() , ["col-6", "duration"]) 
                , cell(lesson["reservation id"], "col-6") 
                , cell(lesson["start location"], "col-12") 
                
            ]
        }
        return head;
    }

    button( id , children ) {       
        var buttonId = id;        
        var obj = {
            "tag": "h2",
            "class": ["accordion-header"],
            "children" : [
                {
                    "tag": "button",
                    "class": ["accordion-button"],
                    "attributes": [
                        {"type" : "button"},
                        {"data-bs-toggle" : "collapse"},
                        {"data-bs-target" : "#" + buttonId },
                        {"aria-expanded" : false },
                        {"aria-controls": buttonId }
                    ],
                    "children" : children
                }
            ]           
        }
        return obj;
    }

    itemBody( id, lesson ) {
        
        var startDate = new Date( lesson["start date"] );

        var obj = {
            "tag": "div",
            "id" : id,
            "class" : ["accordion-collapse", "collapse"],
            "attributes" : [
                { "data-bs-parent" : "#" + this.accordionId }                
            ],
            "children" : [
                {
                    "tag" : "div",
                    "class" : ["accordion-body"],
                    "children" : [
                        this.table(lesson),
                        this.scheduleLink( startDate )
                    ]
                }
            ]
        }
        return obj;
    }

    table(lesson) {

        const columns = [
            { "key" : "reservation id", "title" : "Res ID"},
            { "key" : "activity", "title" : "Activity"},
            { "key" : "hours", "title" : "Duration"},
            { "key" : "guest name", "title" : "Guest"},
            { "key" : "city, state", "title" : "Location"},
            { "key" : "skill level", "title" : "Level"},
            { "key" : "lesson comments", "title" : "Comments"}
        ]

        function rows() {
            var rowArray = [];
            columns.forEach( column => {

                var row = {
                    "tag" : "tr",
                    "children" : [
                        {
                            "tag" : "th",
                            "innerText" : column.title
                        },
                        {
                            "tag" : "td",
                            "innerText" : lesson[column.key]
                        }
                    ]
                }
                rowArray.push(row);
            });
            return rowArray;
        }
        
        var table = {
            "tag" : "table",
            "class" : ["table", "table-sm", "table-striped", "table-hover", "guest-lesson-table"],
            "children" : [
                {
                    "tag" : "tbody",
                    "children" : rows()
                }
            ]
        }
        return table;
    }

    scheduleLink( scheduleDate ) {
        let date = new Date( scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate() );
        const params = new URLSearchParams();
        params.append("date", date.toISOString()); 
        var href = "schedule-v2.html?" + params.toString();
        var link = {
            "tag" : "a",
            "class" : [ "link" ],
            "attributes" : [
                { "href" : href }
            ],
            "innerText" : "View Schedule Day"
        }
        return link;
    }
}
class clientDetails {
    constructor(guest) {
        this.guest = guest;               
    }

    container() {
        var telephone = "";
        var address = this.guest.address.full;
        if (address == undefined) {
            address = "";
        }        
        const accordion = new Accordion(this.guest.lessons).object; 
        
        var obj = {
            "tag": "div",
            "children" : [
                {
                    "tag" : "div",
                    "class" : ["row","mb-3"],
                    "children" : [
                        {
                            "tag" : "div",
                            "class" : ["col-12"],
                            "children" : [
                                {
                                    "tag" : "h2",
                                    "innerText" : this.guest.head_of_house.full
                                }
                            ]
                        },
                        {
                            "tag" : "div",
                            "class" : ["col-12"],
                            "innerText" : address
                        }
                    ]
                },
                {
                    "tag": "div",
                    "class": ["row", "mb-3"],
                    "id" : "guestLessons",
                    "children" : [
                        {
                            "tag" : "div",
                            "class" : "col",
                            "children" : [
                                {
                                    "tag" : "h5",
                                    "innerText" : "Lessons"
                                },
                                {
                                    "tag" : "div",
                                    "id" : "lessonHolder",
                                    "children" : [
                                        accordion
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        return obj;
    }
}

const guestDetail = {
    guest : null,
    load: function () {
        this.url = new URL(window.location.href);
        this.params = new URLSearchParams(this.url.search);
        if (this.params.has("name")) {
            var name = this.params.get("name");
            try {
                var hash = Guests.nameDict[name];
                this.guest = Guests.list[hash];                
            }
            catch {
                console.error("Guest not found.");
            }

            this.details = new clientDetails(this.guest);
            document.getElementById("guestDetails").append( builder(this.details.container()) ); 
        }
    }
}

guestDetail.load();