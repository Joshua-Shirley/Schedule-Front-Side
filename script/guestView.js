class TableMaker {
    constructor(data, keys) {
        this.data = data;
        this.keys = keys;
    }

    table() {
        var obj = {
            "tag": "table",
            "class": ["table", "table-sm", "table-striped", "sortable", "table-hover"],
            "children": [this.head(), this.body()]
        }
        return obj;
    }

    head() {
        var obj = {
            "tag": "thead",
            "children": [this.headerRow()]
        }
        return obj;
    }

    body() {
        var obj = {
            "tag": "tbody",
            "children": this.bodyRows()
        }
        return obj;
    }

    row(children, dataId) {
        var obj = {
            "tag": "tr",            
            "children": children
        }
        if(dataId) {            
            obj["attributes"] = [
                {
                    "rowId" : dataId
                }
            ]
        }        
        return obj;
    }

    headerRow() {
        let cells = [];
        this.keys.forEach(key => {
            if( key == "button") {
                cells.push( this.cellTH("") );
            } else {
                cells.push( this.cellTH(key) );
            }
        });
        return this.row(cells);
    }

    cellTH(inner) {
        var obj = {
            "tag": "th",
            "innerText": inner
        }
        return obj;
    }

    bodyRows() {
        // array to hold all the rows
        var rows = [];

        // roll through each data row
        this.data.forEach(row => {
            // match the row object key with the header keys
            var cells = []
            this.keys.forEach(key => {
                // create a TD object for each key match
                if( key == "button") {
                    cells.push( this.cellWithObj( this.button(row['Link'] )) )
                } else {
                    cells.push( this.cellTD(row[key]) )
                }
            });
            rows.push(this.row(cells, row["Link"]));
        });
        return rows;
    }

    cellTD(inner) {
        var obj = {
            "tag": "td",
            "innerText": inner,
        }
        return obj
    }

    cellWithObj(innerHTML) {
        var cell = {
            "tag": "td",
            "class": ["text-end"],
            "children": [ innerHTML ]                        
        }
        return cell;
    }

    button(hash) {
        var obj = {
            "tag" : "button",
            "class" : ["btn", "btn-dark"],            
            "attributes" : [
                { "value" : hash }
            ],
            "innerText" : "View"
        }
        return obj;
    }
}

const guestTable = {
    data: null,
    table: null,
    initiate: function () {
        this.data = Guests.tableDisplayData();
        this.loadView();
        this.loadInteractions();
        this.table = document.querySelector("table.sortable");
    },
    loadView: function () {
        //const keys = ["Last", "First", "City", "State", "button"];
        const keys = ["Last", "First", "Residence", "button"];
        const table = new TableMaker(this.data, keys);
        document.getElementById("tableholder").append(builder(table.table()));
    },
    loadInteractions: function () {        
        const sortTable = document.querySelector("table.sortable");
                
        const searchInput = document.querySelector("#searchBar");
        searchInput.addEventListener("input", function() { 
            guestTable.searchTable(this.value);
        });

        const sortHeaders = sortTable.querySelectorAll("thead th");
        sortHeaders.forEach(cell => {
            cell.addEventListener("click", (event) => { guestTable.sortByColumnHeader(cell.innerText) });
        });

        const filterData = sortTable.querySelectorAll("tbody td");
        filterData.forEach(cell => {
            //cell.addEventListener("dblclick", (event) => { guestTable.guestInformation(cell.parentElement.getAttribute("rowid")) });
            // set up a touch hold (1 second +) event 
            // touchend - touchstart > 1 second
            //cell.addEventListener("touchend", (event) => { guestTable.guestInformation(cell.parentElement.getAttribute("rowid")) });
        });

        const viewButtons = sortTable.querySelectorAll("button");
        viewButtons.forEach( button => {
            button.addEventListener("click", (event) => {
                guestTable.guestInformation( button.value );
            });
        });
    },
    searchTable: function(value) {
        var sorted = guestTable.data.filter( guest => guest.Last.toLowerCase().includes(value.toLowerCase()) || guest.First.toLowerCase().includes(value.toLowerCase()) );     
                
        guestTable.table.querySelectorAll("tr.visible").forEach( row => {
            row.classList.remove("visible");
        });

        if(value.length > 1 && sorted.length > 0) {
            this.table.classList.add("filtered");
            sorted.forEach( row => {
                document.querySelector("tr[rowId='"+ row.Link +"']").classList.add("visible");
            })
        }
        else {
            this.table.classList.remove("filtered");
        }
    },
    sortByColumnHeader: function(columnText) {
        console.log(columnText);
    },
    guestInformation: function(guestHash) {
        const guest = Guests.list[guestHash];
        const path = "guests.html"
        const params = new URLSearchParams();
        params.append("name", guest.head_of_house.full)
        const url = new URL(window.location.href);
        url.search = params;
        window.location.href = url.toString();
    }

}

guestTable.initiate();

