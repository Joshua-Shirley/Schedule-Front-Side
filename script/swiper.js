class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let swiper = {
    element: null,
    touchStart: null,
    touchEnd: null,
    threshold: 60,
    callBack: {
        right: null,
        left: null,
        up: null,
        down: null,
    },
    // use an dictionary to assign callbacks for "right", "left", "up", "down"
    initiate: function (targetElement, assignments = {}) {

        this.element = targetElement;

        if (assignments instanceof Object) {

            // check for RIGHT assignments
            if (assignments.hasOwnProperty("right")) {
                swiper.callBack.right = assignments["right"];
            }

            // check for LEFT assignments
            if (assignments.hasOwnProperty("left")) {
                swiper.callBack.left = assignments["left"];
            }

            // check for UP assignments
            if (assignments.hasOwnProperty("up")) {
                swiper.callBack.up = assignments["up"];
            }

            // check for DOWN assignments
            if (assignments.hasOwnProperty("down")) {
                swiper.callBack.down = assignments["down"];
            }
        }

        swiper.addTouchEvents();
    },

    segmentLength: function (point1, point2) {
        // point1, point2 are of class Point
        if (point1 instanceof Point && point2 instanceof Point) {
            var x = (point2.x - point1.x) ** 2;
            var y = (point2.y - point1.y) ** 2;
            var distance = Math.sqrt(x + y);
            return distance;
        }
        return 0;
    },

    calculateAngle: function (anchor, endPoint) {
        if (anchor instanceof Point) {
            if (endPoint instanceof Point) {
                var angle = Math.atan2(endPoint.y - anchor.y, endPoint.x - anchor.x) * (180 / Math.PI);
                // flip the points around if they are more than 180 degrees.
                if (angle < 0) {
                    angle = Math.atan2(anchor.y - endPoint.y, anchor.x - endPoint.x) * (180 / Math.PI) + 180;
                }
                return angle;
            }
            else {
                console.error("angleDegrees: endPoint is not of type Point.");
            }
        } else {
            console.error("angleDegrees: anchor is not of type Point.");
        }
    },

    addTouchEvents: function () {

        swiper.element.addEventListener('touchstart', (event) => {
            // Use the point class to hold the points
            swiper.touchStart = new Point(event.touches[0].clientX, event.touches[0].clientY);
        });

        swiper.element.addEventListener("touchend", (event) => {
            swiper.touchEnd = new Point(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

            // calculate the length of the swipe
            var segment = swiper.segmentLength(swiper.touchStart, swiper.touchEnd);

            // moved enough / more than the threshold
            if (segment > swiper.threshold) {

                var angle = swiper.calculateAngle(swiper.touchStart, swiper.touchEnd);
                // Vertical swipe Down
                if (angle < 135 && angle > 45) {
                    if (swiper.callBack.down != null) { 
                        swiper.callBack.down();
                    }
                    return;
                }
                // Vertical swipe up
                if (angle > 225 && angle < 315) {
                    if (swiper.callBack.up != null) {                    
                        swiper.callBack.up();
                    }
                    return;
                }
                // Horizontal swipe right
                if (angle <= 45 || angle >= 315) {
                    if (swiper.callBack.right != null) {                    
                        swiper.callBack.right();
                        return;
                    }
                }
                // Horizontal swipe left
                if (angle >= 135 && angle <= 225) {
                    if (swiper.callBack.left != null) {                    
                        swiper.callBack.left();
                        return;
                    }
                }
            }
        });
    }
}