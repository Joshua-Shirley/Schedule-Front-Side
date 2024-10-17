class Calendar {
    constructor(date) {
        if (!date) {
            var date = new Date();
        }
        this.entryDate = date;
        //console.log(this.entryDate);
        this.month = date.getMonth();
        this.list = [];
        this.loadList(this.entryDate);
    }
    loadList(date) {
        // first day of the month
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // end day of the month
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        // add additional days to complete the week view (Saturday)
        lastDay = this.findSaturday(lastDay);
        // find the beginning date.
        var sunday = this.findSunday(firstDay);
        // add these dates into the calendar list array
        var rolling = sunday;
        while (!rolling.moreThan(lastDay)) {
            //console.log(rolling.getDay(), rolling);            
            this.list.push(rolling);
            rolling = this.nextDay(rolling);
            //console.log(builder(this.tableCell(rolling)));
        }
    }
    nextDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
    findSunday(date) {
        while (date.getDay() != 0) {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        }
        return date;
    }
    findSaturday(date) {
        while (date.getDay() != 6) {
            date = this.nextDay(date);
        }
        return date;
    }
    view() {
        var parts = [];
        parts.push(this.monthHeader());
        parts.push(this.tableMonth());
        parts.push(this.footer());
        var html = {            
            "tag": "div",
            "class" : ["calendar", "mb-5"],
            "id": "calendarView",
            "children": parts
        };
        return html;
    }
    footer() {
        var previousMonth = new Date(this.entryDate.getFullYear(), this.entryDate.getMonth() -1 , 1);
        var nextMonth = new Date(this.entryDate.getFullYear(), this.entryDate.getMonth() + 1, 1);
        var div = {
            "tag" : "div",
            "class" : ["row", "text-center", "align-items-start", "p-4"],
            "children" : [
                {
                    "tag": "div",
                    "class": ["col"],
                    "children" : [
                        {
                            "tag": "button",
                            "class" : ["btn","btn-dark"],
                            "innerText": previousMonth.toLocaleDateString("default", { month: "long" }),
                            "attributes": [
                                { 
                                    "type":"button",                                     
                                    "value": previousMonth.toISOString(),
                                    "onclick": "loadMonth('" + previousMonth.toISOString() + "')"
                                }
                            ]
                        },
                    ]
                },
                {
                    "tag": "div",
                    "class": ["col"],
                    "children" : [                        
                        {
                            "tag" : "a",
                            "class" : ["btn", "btn-dark-2", "mx-1"],
                            "attributes" : [
                                {
                                    "href" : "?date=" + (new Date()).toLocaleString("default", { month: "2-digit", day: "2-digit", year: "numeric"}).replaceAll("/","-"),
                                }
                            ],
                            "innerText" : "Today"
                        }
                    ]                    
                },
                {
                    "tag": "div",
                    "class": ["col"],
                    "children" : [
                        {
                            "tag": "button",
                            "class" : ["btn","btn-dark"],
                            "innerText": nextMonth.toLocaleDateString("default", { month: "long" }),
                            "attributes": [
                                { 
                                    "type":"button",                                     
                                    "value": nextMonth.toISOString(),
                                    "onclick": "loadMonth('" + nextMonth.toISOString() + "')"
                                }
                            ]
                        }
                    ]
                }
            ],            
        }
        return div;
    }
    monthHeader() {        
        var header = {
            "tag": "h2",
            "children" : [
                {
                    "tag": "div",
                    "class": ["d-flex","justify-content-center"],
                    "children" : [

                        {
                            "tag": "span",
                            "class" : ["month-title"],
                            "innerText": this.entryDate.toLocaleDateString("default", { month: "long", year: "numeric" }),
                        }
                    ]
                }
            ]            
        }
        return header;
    }
    tableMonth() {
        var month = {
            "tag": "table",
            "class": ["table"],
            "children": [
                {
                    "tag": "thead",
                    "children": this.tableHeader()
                },
                {
                    "tag": "tbody",
                    "children": this.tableRow(),
                }
            ]
        }
        return month;
    }
    tableHeader() {
        var weekDay = [];
        for (var index = 0; index < 7; index++) {
            var dayName = this.list[index].toLocaleString("default", { weekday: "long" })
            var th = {
                "tag": "th", 
                "children": [
                    {
                        "tag": "span",
                        "class": "abbreviation",
                        "innerText" : dayName.substring(0,3)
                    },
                    {
                        "tag": "span",
                        "class": "fullName",
                        "innerText" : dayName
                    }
                ]
            }
            weekDay.push(th);
        }
        var header = {
            "tag": "tr",
            "children": weekDay
        }
        return header;
    }
    tableRow() {
        var month = [];
        var week = { "tag": "tr", "children": [] };
        var days = [];

        this.list.forEach(day => {
            if (day.getDay() == 0) {
                days = [];
            }
            days.push(this.tableCell(day));
            if (day.getDay() == 6) {
                week = {
                    "tag": "tr",
                    "children": days
                }
                month.push(week);
            }
        });
        return month;
    }
    tableCell(date) {
        var classes = [];
        classes.push("calendar-day");
        // is the date outside the month scope
        if (date.getMonth() != this.month) {
            classes.push("outer-day");
        }
        // is the date == today
        if (date.compareDate(new Date())) {
            classes.push("today");
        }

        // highlight the entry date
        if (date.compareDate(this.entryDate)){
            classes.push("selected");
        }

        var dateString = date.toLocaleString("default", { month: "2-digit", day: "2-digit", year: "numeric"}).replaceAll("/","-");
        var cell = {
            "tag": "td",
            "children": [
                {
                    "tag": "a",
                    "class": classes,
                    "attributes": [
                        {
                            "date": dateString,
                            "href": "?date=" + dateString
                        }
                    ],
                    "innerText": date.getDate(),
                },
            ]
        }
        return cell;
    }
}

Date.prototype.moreThan = function (dateB) {
    if (this.valueOf() > dateB.valueOf()) {
        return true;
    }
    return false;
};

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

String.prototype.toProperCase = function() {
    return this.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');    
}