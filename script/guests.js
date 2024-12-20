class Person {
    constructor(fullname) {
        this.full = fullname;
        this.first = null;
        this.last = null;
        this.splitName();
    }
    splitName() {
        var nameArray = this.full.replace("  ", " ").split(" ");
        this.first = nameArray[0].trim();
        this.last = nameArray[1].trim();
    }
    addAge(age) {
        this.age = age;
    }
    addGender(gender) {
        if (gender.toLowerCase() == "male") {
            this.gender = "male";
        }
        else if (gender.toLowerCase() == "female") {
            this.gender = "female";
        }
    }
}

class Address {
    constructor(input) {
        if (input == undefined) {
            return;
        }
        this.full = input;
        this.city = null;
        this.state = null;
        this.splitLocation();
    }
    splitLocation() {
        var array = this.full.split(",");
        this.city = array[0].trim();
        this.state = array[1].trim();
    }
}

class Guest {
    constructor(client, guest, cityState) {
        this.head_of_house = new Person(client);
        this.guest_name = new Person(guest);
        this.address = new Address(cityState);
        this.lessons = [];
        this.people = [];
        this.hash = this.hashCode(this.head_of_house.full);
    }
    add(lessons) {
        lessons.forEach(lesson => {
            this.lessons.push(lesson);
        });
    }
    people(person) {
        this.people.push(person);
    }
    toDict() {
        const dict = {};
        dict["head_of_house"] = this.head_of_house.full;
        dict["guest_name"] = this.guest_name.full;
        dict["city_state"] = this.address.full;
        dict["lessons"] = this.lessons;
        return dict;
    }
    hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
}

const Guests = {
    initiate: function (schedule) {
        this.list = {};
        this.schedule = schedule;
        this.keys = Object.keys(schedule);
        this.privateLessons = this.populateLessons();
        this.populateGuests();
        this.matchLessons();
        this.nameDict = this.nameReference();
    },
    populateLessons: function () {
        let private = [];
        Guests.keys.forEach(key => {
            var day = Guests.schedule[key];

            try {
                day.forEach(evt => {
                    if (evt.hasOwnProperty("activity") && evt.hasOwnProperty("assignment")) {
                        if (evt["activity"].toLowerCase().includes("private")) {
                            private.push(evt);
                        }
                    }
                });
            }
            catch (error) {
                console.log(day);
                console.error(error);
            }
        });
        return private;
    },
    populateGuests: function () {
        Guests.privateLessons.forEach(lesson => {
            if (lesson.hasOwnProperty("client name")) {
                var guest = new Guest(lesson["client name"], lesson["guest name"], lesson["city, state"]);                
                var hash = guest["hash"]
                try {
                    Guests.list[hash] = guest;
                }
                catch {
                    console.log(guest);
                }
            }
        });
    },
    matchLessons: function () {
        Object.keys(Guests.list).forEach(hash => {            
            var guest = Guests.list[hash];
            Guests.list[hash].add(Guests.pastLessons(guest));
        });
    },
    pastLessons: function (guest) {
        const lessons = [];

        Guests.privateLessons.forEach(private => {
            if (private["client name"] == guest["head_of_house"]["full"]) {
                lessons.push(private);
            }
        });

        return lessons;
    },
    tableDisplayData: function () {
        const data = [];
        Object.keys(Guests.list).forEach(key => {
            if (key != undefined) {
                var guest = Guests.list[key];
                var rowObj = {
                    "Link": guest["hash"],
                    "Last": guest["head_of_house"]["last"],
                    "First": guest["head_of_house"]["first"]
                }
                if (guest["address"] != undefined) {                    
                    if (guest.address.full != undefined) {
                        rowObj["Residence"] = guest.address.full;
                    } else {
                        rowObj["Residence"] = "";
                    }

                } else {
                    rowObj["Residence"] = "";
                }

                data.push(rowObj);
            }
        });

        return data.sort((a, b) => a["Last"].localeCompare(b["Last"]));
    },
    nameReference: function () {
        var names = {};
        Object.keys(Guests.list).forEach(hash => {
            var guest = Guests.list[hash];
            names[guest.head_of_house.full] = guest.hash;
        });
        return names;
    }
}

loadFullSchedule.initiate(new Date());
Guests.initiate(loadFullSchedule.data);