class Calendar {
    constructor(date, urlController) {
        this.linkGenerator = urlController;
        if (!date) {
            var date = new Date();
        }
        this.entryDate = date;
        //console.log(this.entryDate);
        this.month = date.getMonth();
        this.list = [];
        this.loadList(this.entryDate);
    }
    reload(date) {
        console.log("reload: ", date);
        this.entryDate = date;
        this.month = date.getMonth();
        console.log("reload month: ", this.month);
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
            this.list.push(rolling);
            rolling = this.nextDay(rolling);
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
    linkBuilder(date) {
        if (date instanceof Date) {
            return this.linkGenerator.link(date);
        } else {
            throw error(date, " is not a DateTime object.");
        }
    }
    view() {
        var parts = [];
        parts.push(this.monthHeader());
        parts.push(this.tableMonth());
        parts.push(this.footer());
        var html = {
            "tag": "div",
            "class": ["calendar"],
            "id": "calendarView",
            "children": [
                {
                    "tag": "form",
                    "id": "calendarForm",
                    "children": parts
                }
            ]
        };
        return html;
    }

    selectSeason() {
        var seasons = [];
        const year = new Date().getFullYear();
        for (var index = 0; index <= parseInt(settings.seasonRange); index++) {
            var sYear = year - index;
            var season = (sYear) + '-' + (sYear + 1);
            seasons.push(season);
        }
        var options = [];
        while (seasons.length > 0) {
            var s = seasons.shift();
            var option = {
                "tag": "option",
                "attributes": [
                    { "value": s }
                ],
                "innerText": s
            }
            options.push(option);
        }
        var select = {
            "tag": "select",
            "class": ["calendar-select"],
            "id": "calendarSeasons",
            "attributes": [
                { "name": "seasons" },
                { "aria-label": "Default select" }
            ],
            "children": options
        }
        return select;
    }

    selectMonth() {
        var monthOptions = [];
        const monthNames = ["November", "December", "January", "February", "March", "April"];
        for (var index = 0; index < monthNames.length; index++) {
            var option = {
                "tag": "option",
                "attributes": [
                    { "value": monthNames[index] }
                ],
                "innerText": monthNames[index]
            }
            monthOptions.push(option);
        }
        var select = {
            "tag": "select",
            "class": ["calendar-select"],
            "id": "calendarMonths",
            "attributes": [
                { "name": "months" },
                { "aria-label": "Default select" }
            ],
            "children": monthOptions
        }
        return select;
    }

    footer() {
        var previousMonth = new Date(this.entryDate.getFullYear(), this.entryDate.getMonth() - 1, 1);
        var nextMonth = new Date(this.entryDate.getFullYear(), this.entryDate.getMonth() + 1, 1);
        var div = {
            "tag": "div",
            "class": ["row", "align-items-start", "text-center"],
            "children": [
                {
                    "tag": "div",
                    "class": ["col-4"],
                    "children": [
                        {
                            "tag": "a",
                            "class": ["btn", "btn-dark", "calendar-month"],
                            "innerText": previousMonth.toLocaleDateString("default", { month: "long" }),
                            "attributes": [
                                {
                                    "href": this.linkBuilder(previousMonth),
                                },
                                {
                                    "value": previousMonth.toISOString()
                                }
                            ]
                        },
                    ]
                },
                {
                    "tag": "div",
                    "class": ["col-4"],
                    "children": [
                        {
                            "tag": "a",
                            "class": ["btn", "btn-dark", "calendar-today"],
                            "attributes": [
                                {
                                    "onclick" : ""
                                },
                                {
                                    "href": "" //this.linkBuilder(new Date()),
                                }
                            ],
                            "innerText": "Today"
                        }
                    ]
                },
                {
                    "tag": "div",
                    "class": ["col-4"],
                    "children": [
                        {
                            "tag": "a",
                            "class": ["btn", "btn-dark", "calendar-month"],
                            "innerText": nextMonth.toLocaleDateString("default", { month: "long" }),
                            "attributes": [
                                {
                                    "href": this.linkBuilder(nextMonth),
                                },
                                {
                                    "value": nextMonth.toISOString()
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
            "children": [this.selectSeason(), this.selectMonth()],
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
                        "innerText": dayName.substring(0, 3)
                    },
                    {
                        "tag": "span",
                        "class": "fullName",
                        "innerText": dayName
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
        if (date.compareDate(this.entryDate)) {
            classes.push("selected");
        }

        var dateString = date.toLocaleString("default", { month: "2-digit", day: "2-digit", year: "numeric" }).replaceAll("/", "-");
        var cell = {
            "tag": "td",
            "children": [
                {
                    "tag": "a",
                    "class": classes,
                    "attributes": [                       
                        {                            
                            "date": dateString,
                            "href": this.linkBuilder(date),
                        }
                    ],
                    "innerText": date.getDate(),
                },
            ]
        }
        return cell;
    }
    Key() {
        var keyArray = [
            { "text": "Today", "class": "today" },
            { "text": "Scheduled Work Day", "class": "scheduled" },
            { "text": "Private Request", "class": "privateRequest" },
            { "text": "Local Program", "class": "programDay" },
            { "text": "Selected Date", "class": "selected" }
        ]

        var button = {
            "tag": "button",
            "class": ["btn", "btn-link"],
            "attributes": [
                { "type": "button" },
                { "data-bs-toggle": "collapse" },
                { "data-bs-target": "#calendarKey" },
                { "aria-expanded": "false" },
                { "aria-controls": "calendarKey" }
            ],
            "innerText": "Calendar Key"
        }

        var rows = [];
        keyArray.forEach(key => {
            var row = {
                "tag": "tr",
                "children": [
                    {
                        "tag": "td",
                        "class": ["text-end"],
                        "children": [
                            {
                                "tag": "a",
                                "class": ["calendar-day", key.class]
                            }
                        ]
                    },
                    {
                        "tag": "td",
                        "class": ["text-start"],
                        "innerText": key.text
                    }
                ]
            }
            rows.push(row);
        });
        var key = {
            "tag": "div",
            "class": ["table-key"],
            "children": [
                {
                    "tag": "button",
                    "class": ["btn", "btn-link", "mb-3"],
                    "attributes": [
                        { "type": "button" },
                        { "data-bs-toggle": "collapse" },
                        { "data-bs-target": "#keyView" },
                        { "aria-expanded": "false" },
                        { "aria-controls": "keyView" }
                    ],
                    "innerText": "Calendar Key"
                },
                {
                    "tag": "div",
                    "class": ["collapse", "text-center"],
                    "id": "keyView",
                    "children": [
                        {
                            "tag": "table",
                            "class": ["table", "table-sm", "table-borderless"],
                            "children": [
                                {
                                    "tag": "tbody",
                                    "children": rows
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        return builder(key);
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

String.prototype.toProperCase = function () {
    return this.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}