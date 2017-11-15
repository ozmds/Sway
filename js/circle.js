class Circle {
    constructor(type) {
        this.type = type;

        this.img = new Image();
        this.backimg = new Image();

        this.img.src = 'data/images/' + type + '.png';
        this.backimg.src = 'data/images/' + type + '-background.png';

        this.aspectratio = this.img.width / this.img.height;

        this.width = 0;
        this.height = 0;

        this.x = null;
        this.y = null;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(x) {
        this.y = x;
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
    }

    draw() {
        CONTEXT.drawImage(this.img, this.x - this.height * 0.5,
            this.y - this.height * 0.5, this.aspectratio * this.height,
            this.height);
    }

    drawBack() {
        CONTEXT.drawImage(this.backimg, this.x - this.height * 0.5,
            this.y - this.height * 0.5, this.aspectratio * this.height,
            this.height);
    }
}
