class Table {
    constructor( arrayOfObjects ) {
        if( arrayOfObjects ) {

            this.data = arrayOfObjects;           

            // header row
            this.headCells = this.headerRowData();

            // rows and cells
            this.bodyRows = this.bodyRowData();

        }

        this.thead = this.theadElement();
        this.tbody = this.tbodyElement();        
        this.tfoot = this.tfootElement();
        this.table = this.tableElement();
    }

    built() {
        return builder(this.table);
    }

    headerRowData() {
        var cells = [];        
        Object.keys(this.data[0]).forEach(key => {
            cells.push(  this.cell(key) );
        });
        var row = this.rowElement();
        row.children = cells;
        return row;
    }

    bodyRowData() {
        var rows = [];        
        this.data.forEach( row => {
            
            var r = this.rowElement();
            Object.keys(row).forEach( key => {
                r.children.push( this.cell( row[key] ) );
            });
            rows.push(r);

        });
        return rows;
    }

    tableElement() {
        var table = {
            "tag" : "table",
            "class" : ["table", "table-sm", "table-striped", "table-hover", "guest-lesson-table"],
            "children" : []
        }
        table.children.push(this.thead);
        table.children.push(this.tbody);
        table.children.push(this.tfoot);
        return table;
    }

    theadElement() {
        let head = {
            "tag": "thead",
        }
        if (this.headCells ) {
            head.children = this.headCells;
        }
        return head;
    }
    
    tbodyElement() {
        let body = {
            "tag": "tbody",
            "children": []
        }
        if (this.bodyRows) {
            body.children = this.bodyRows;
        }
        return body;
    }

    tfootElement() {
        let foot = {
            "tag": "tfoot",
            "children": []
        }
        return foot;
    }

    rowElement() {
        let row = {
            "tag" : "tr",
            "children" : []
        }
        return row;
    }

    cell(innerText) {
        let td = {
            "tag" : "td",
            "innerText" : innerText
        }        
        return td;
    }

    headCell(innerText) {
        let th = {
            "tag": "th",
            "innerText": innerText
        }
        return th;
    }
}