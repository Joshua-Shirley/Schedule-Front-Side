const pageload = {
    initiate: function(date) {
        this.date = date;
        // update any titles (once)
        pageload.titles();

        //pageload.calendarSchedule();
    },
    titles: function() {
        // LOAD ONCE
        // 1 - instructor name
        // 2 - ski area 
        // Set inner text 
        document.querySelector("#instructor-name").innerText = settings.fullName;
        document.querySelector("#instructor-area").innerText = settings.skiArea;
    },
    pageDate: function(date) {
        // RELOAD
        // Update Titles and Date Strings
        document.querySelector("#title-date").innerText = date.toLocaleDateString("default", { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" });
    },

    eventBlock: function(date) {
        let key = date.toISOString();
        let dayEvents = Schedule.data[key];
        let block = new Blocks(dayEvents, date);
    },
    
    // load the schedule block    
    calendarSchedule: function() {
        const month = pageload.date.getMonth();
        const year = pageload.date.getFullYear();
        const list = Object.keys(Schedule.data);
        const days = list.filter((key) => (new Date(key)).getMonth() == month && (new Date(key)).getFullYear() == year);
        days.forEach(key => {
            var activities = Schedule.data[key];
            if (activities.length > 0) {
                activities.forEach(activity => {
                    if (activity.hasOwnProperty("activity")) {
                        var description = activity["activity"].toLowerCase();
                        if (!description.includes("day off")) {
                            try {
                                var dateString = (new Date(key)).toLocaleString("default", 
                                    { month: "2-digit", day: "2-digit", year: "numeric" })
                                    .replaceAll("/", "-");
                                var targetElement = document.querySelector("a[date='" + dateString + "']");
                                targetElement.classList.add("scheduled");
                            }
                            catch {
                                console.log(dateString, " not found");
                            }

                            if (activity["activity"].toLowerCase().includes("farm")) {
                                targetElement.classList.add("programDay");
                            }

                            if (activity["activity"].toLowerCase().includes("program")) {
                                targetElement.classList.add("programDay");
                            }

                            if (activity["assignment"].toLowerCase().includes("private request")) {
                                // private request
                                targetElement.classList.add("privateRequest");
                            }
                        }
                    }
                })
            }
        });
    } 
}