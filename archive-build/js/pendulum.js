class Pendulum {
    constructor() {
        this.cen = new PenPart('center');
        this.pen = new PenPart('pendulum');
        this.linklist = [];

        this.cen.setY(CANVAS.height * 0.6);
        this.pen.setY(CANVAS.height - (this.pen.getHeight() * 0.5 + PADDING));

        this.calcLinks();
    }

    calcLinks() {
        var armdist = (this.pen.getY() - this.pen.getHeight() * 0.5) -
                        (this.cen.getY() + this.cen.getHeight() * 0.5);

        var link = new PenPart('link');

        var numlinks = 0;

        if (armdist > 0) {
            numlinks = Math.floor(armdist / link.getHeight());
        }

        var linkspace = (armdist - numlinks * link.getHeight()) / (numlinks + 1);

        var startpoint = this.cen.getY() + this.cen.getHeight() * 0.5;

        for (var i = 0; i < numlinks; i++) {
            var newlink = new PenPart('link');
            newlink.setY(startpoint + linkspace + newlink.getHeight() * 0.5);
            this.linklist.push(newlink);
            startpoint = startpoint + linkspace + newlink.getHeight();
        }
    }

    draw() {
        this.cen.draw();
        this.pen.draw();

        for (var i = 0; i < this.linklist.length; i++) {
            this.linklist[i].draw();
        }
    }

    drawBack() {
        this.cen.drawBack();
        this.pen.drawBack();

        for (var i = 0; i < this.linklist.length; i++) {
            this.linklist[i].drawBack();
        }
    }
}
