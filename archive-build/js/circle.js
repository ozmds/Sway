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
        this.r = null;
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
