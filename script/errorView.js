class ErrorDisplay {
    constructor(builder, urlController) {
        this.HTMLBuilder = builder;
        this.controller = urlController;
        var today = new Date();
        this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.queue = [];
        this.style();
    }
    throw(title, message) {
        var time = new Date();
        this.queue.push({ title, message, time });
    }
    display() {
        if (this.queue.length > 0) {
            const element = document.querySelector("body");
            element.prepend(this.HTMLBuilder(this.bubble()));
            element.scrollIntoView();
        }
    }
    style() {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        document.head.appendChild(style);

        var css = [];
        css.push("#error { background-color: mistyrose; color: black; border: 1px solid red; padding: 6px 12px; border-radius: 3px; margin: 10px 10px 30px 10px; }");
        css.push("#error .header {font-size: 1.4em;}");
        css.push("#error .footer { text-align: right; }");
        css.push("#error .returnLink { display: inline-block; }");
        css.push("#error .btn {text-decoration: none; color: white; background-color: #1067ab; padding: 6px 12px; border: 1px solid blue; border-radius: 3px; font-size: 14px; line-height: 1.4em;margin: 0 0 1.2em 0;    display: inline-block;}");

        style.append(css.join(""));
    }
    bubbleError(obj) {
        const error = {
            "tag": "div",
            "class": ["row", "errorItem"],
            "children": [
                {
                    "tag": "div",
                    "class": ["col-2", "index"],
                    "innerText": "Error 1",
                },
                {
                    "tag": "div",
                    "class": ["col-10", "timestamp"],
                    "innerText": obj.time,
                },
                {
                    "tag": "div",
                    "class": ["col-12"],
                    "innerText": obj.title,
                },

                {
                    "tag": "div",
                    "class": ["col-12", "message"],
                    "innerText": obj.message,
                },
            ]
        }
        return error;
    }
    bubbleErrors() {
        const array = [];
        while (this.queue.length > 0) {
            array.push(this.bubbleError(this.queue.shift()));
        }
        return array;
    }
    bubble() {
        const errorBubble = {
            "tag": "div",
            "id": "error",
            "class": ["error"],
            "children": [
                {
                    "tag": "div",
                    "class": ["header"],
                    "innerText": "Thrown Errors"
                },
                {
                    "tag": "div",
                    "class": ["items"],
                    "children": this.bubbleErrors(),
                },
                {
                    "tag": "div",
                    "class": ["footer"],
                    "children": [
                        {
                            "tag": "a",
                            "class": ["returnLink", "btn"],
                            "attributes": [
                                {
                                    "href": this.linkWithDate(),
                                }
                            ],
                            "innerText": "Return",
                        }
                    ]
                }
            ]
        }
        return errorBubble;
    }
    linkWithDate() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams();
        // set the time to zeros

        params.append("date", this.date.toISOString());
        url.search = "";
        url.search = params;
        return url.toString();
    }
}

const errorDisplay = new ErrorDisplay(builder);

document.addEventListener("readystatechange", event => {
    if (document.readyState == "interactive") {
        errorDisplay.display();
    }
});