function guestTable(obj) {
    id = "";
    name = "";
    expanded = true;
    link = {
        "tag" : "a",
        "class" : ["btn", "btn-link"],
        "attributes" : [
            {
                "data-bs-toggle" : "collapse",
                "href" : "#" + id,
                "role" : "button",
                "aria-expanded" : expanded,
                "aria-controls" : "collapse" + name,                
            }
        ],
        "innerText" : "Guest Details"        
    }
    table = {
        "tag" : "div",
        "class" : ["collapse"],
        "id" : id,
        "children" : [
            {
                "tag" : "div",
                "class" : ["card", "card-body"],
                "children" : [
                    {
                        "tag" : "table",
                        "class" : ["table", "guestNotes"],
                        "children" : [
                            {
                                "tag" : "tbody",
                                "children" : [
                                    {
                                        rows
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

}

function guestTableRows(key,value) {
    row = {
        "tag" : "tr",
        "children" : [
            {
                "tag" : "th",
                "innerText" : key
            },
            {
                "tag" : "td",
                "attributes" : [
                    {
                        "data-type" : ""
                    }
                ],
                "innerText": value
            }
        ]
    }
    return row
}

function scheduleBlock(obj) {
    accordionId = "scheduleAccordion"
    itemId = "collapseOne"
    show = "show"
    activity = "PCY: Off (Regular Day Off)"

    // What are the main essential items


    // Guest Related Items



    // Lesson Related Items


    // Admin Related Items


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
                            "data-bs-target" : "#" + itemId,
                            "aria-expanded": "true",
                            "aria-controls": itemId }
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
                "id": itemId,
                "class": ["accorion-collapse", "collapse", show],
                "attributes" : [
                    { "data-bs-parent": "#" + accordionId }
                ],
                "children": [
                    {
                        "tag": "div",
                        "class": ["accordion-body"],
                        "children": [
                            {                                
                                "tag": "h3",
                                "innerText": activity
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
}