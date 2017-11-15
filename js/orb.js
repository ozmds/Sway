class Orb extends Circle {
    constructor(type) {
        super(type);
        this.setSize();
        this.place();
        this.y = -(this.r * 2);
    }

    place() {
        this.x = Math.round(Math.random() * (CANVAS.width - 4 * this.r)) + 2 * this.r;
    }

    move(x) {
        this.y += x;
    }

    setSize() {
        this.height = CANVAS.width * 0.14;
        this.width = this.height * this.aspectratio;
        this.r = this.height / 2;
    }
}
