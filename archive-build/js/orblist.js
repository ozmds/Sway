class OrbList {
    constructor() {
        this.orblist = [];
        this.hitlist = [];
        this.counter = 0;
        this.randint = 0;
    }

    newType() {
        this.randint = Math.random() * 100;
        if (this.randint < 16) {
            return 'diamond';
        } else if (this.randint < 32) {
            return 'bomb';
        } else if (this.randInt < 48) {
            return 'small';
        } else if (this.randInt < 64) {
            return 'bombrain';
        } else if (this.randInt < 80) {
            return 'double';
        } else {
            return 'spike';
        }
    }

    move() {
        if (this.counter >= ORB_INTERVAL) {
            this.orblist.push(new Orb(this.newType()));
            this.counter = 0;
        }

        this.counter += TIME_INTERVAL;

        for (var i = 0; i < this.orblist.length; i++) {
            this.orblist[i].move(CANVAS.height / 150);
        }
    }

    draw() {
        for (var i = 0; i < this.orblist.length; i++) {
            this.orblist[i].drawBack();
            this.orblist[i].draw();
        }
    }
}
