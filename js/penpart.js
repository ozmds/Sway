class PenPart extends Circle {
    constructor(type) {
        super(type);
        this.x = CANVAS.width * 0.5;
        this.setSize();
    }

    setSize() {
        if (this.type == 'pendulum') {
            this.height = CANVAS.width * 0.20;
        } else if (this.type == 'center') {
            this.height = CANVAS.width * 0.10;
        } else if (this.type == 'link') {
            this.height = CANVAS.width * 0.08;
        }

        this.width = this.height * this.aspectratio;
        this.r = this.height / 2;
    }
}
