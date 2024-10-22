class ErrorDisplay {
    constructor(targetElement, builder) {
        this.HTMLBuilder = builder;
        this.element = document.querySelector("body");
        var today = new Date();
        this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.style();        
    }
    throw(title, message) {
        document.body.prepend( this.HTMLBuilder( this.bubble(title, message)));        
    }
    style() {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        document.head.appendChild(style);

        var css = [];
        css.push("#error { background-color: mistyrose; color: black; border: 1px solid red; padding: 6px 12px; border-radius: 6px; margin: 10px 10px 30px 10px; }");
        css.push("#error .title {font-size: 1.4rem; font-weight: 700; margin: 1rem 0;}");
        css.push("#error .message {padding-top: 1.2rem; padding-bottom: 2.4rem; }");
        css.push("#error .footer { text-align: right; }")
        css.push("#error .returnLink { display: inline-block; }");

        style.append(css.join(""));
    }
    bubble(title, message) {
        const errorBubble = {
            "tag": "div",
            "id": "error",
            "class": ["error"],
            "children": [
                {
                    "tag": "div",
                    "class": ["errorItem"],
                    "children": [
                        {
                            "tag": "h4",
                            "class": ["title"],
                            "innerText": title,
                        },
                        {
                            "tag": "div",
                            "class": ["message"],
                            "innerText": message,
                            "children": [],
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

const errorDisplay = new ErrorDisplay(document.body, builder);