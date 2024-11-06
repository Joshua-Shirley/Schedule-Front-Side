class URLControl {
    constructor(date) {
        this.url = new URL(window.location.href);
        this.params = new URLSearchParams(this.url.search);
        this.date = date;
        this.saveDate();
    }

    saveDate() {
        if( this.params.has("date") ) {
            var date = this.params.get("date");
            try {
                this.date = new Date(date);
            }
            catch {
                console.error("Parameter date: is not a date type");
            }
        }
    }

    link(date = this.date) {
        if ( date instanceof Date) {
            const param = new URLSearchParams();
            param.append("date", this.zeroDate(date).toISOString());
            this.url.search = "";
            this.url.search = param;
            return this.url.toString();
        } 
        throw error ("not a date");
    }

    zeroDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() );
    }
}