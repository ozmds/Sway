class OrbList {
    constructor() {
        this.orbList = [];
        this.hitList = [];
        this.speed = 0;
        this.score = 0;
    }

    calculateSpeed(cnv) {
        window.alert(cnv.height);

        this.speed = cnv.height / (orb_time / TIME_INTERVAL);
    }

    createOrb(score, pen) {
        var d = new Orb(this.cnv.width * 0.035, this.ctx, this.cnv, score, this.speed);
        d.place(pen.getArm().getMaxLen(), pen.getPen().getR());
        this.orbList.push(d);
    }

    incrementOrbTime(score, cnv) {
        /* Increase the speed of all orbs */
        if ((score % 10 == 0) && (score <= 200)) {
            orb_time = ORB_START_TIME - (score / 10) * ORB_DECREMENT_TIME;
            this.calculateSpeed(cnv);
        }
    }

    incrementOrbFrequency(score) {
        /* Increase Frequency of all orbs */
        if ((score % 15 == 0) && (score <= 300)) {
            orb_frequency = ORB_FREQ_START_TIME - (score / 15) * ORB_FREQ_DECREMENT_TIME;
        }
    }

    checkHit(orb, pen1, pen2) {
        if (orb.checkHitPen(pen1.getX(), pen1.getY(), pen1.getR())) {
            return true;
        } else if (orb.checkHitPen(pen2.getX(), pen2.getY(), pen2.getR())) {
            return true;
        }

        return false;
    }

    drawOrbs() {
        var i;

        for (i = 0; i < this.orbList.length; i++) {
            this.orbList[i].draw();
        }

        for (i = 0; i < this.hitList.length; i++) {
            this.hitList[i].draw();
        }
    }

    manageHitList(i) {
        /* Move All Orbs That Have Been Hit */
        for (i = 0; i < this.hitList.length; i++) {
            this.hitList[i].updateHitTimer(TIME_INTERVAL);

            if (this.hitList[i].getHitTimer() > 2000) {
                this.hitList.splice(i, 1);
            } else {
                this.hitList[i].move(-0.5);
            }
        }
    }

    manageOrbs(score, pen, cnv) {
        var i;

        this.score = 0;

        if (time_counter >= orb_frequency) {
            time_counter = 0;
            this.createOrb(score, pen);
        }

        for (i = 0; i < this.orbList.length; i++) {
            this.orbList[i].move(1);

            if (this.orbList[i].getY() > (this.cnv.height + this.orbList[i].getR() * 2)) {
                if (this.orbList[i].getType() == REGULAR) {
                    this.orbList.splice(i, 1);
                    this.score = 0;
                }
            } else if (this.checkHit(this.orbList[i], pen.getPen(), pen.getSPen())) {
                this.hitList.push(this.orbList[i]);

                if (this.orbList[i].getType() == REGULAR) {
                    this.score = this.score + 1;
                    this.incrementOrbTime(score, cnv);
                    this.incrementOrbFrequency(score);
                }

                this.orbList.splice(i, 1);
            }
        }

        this.manageHitList(i);

        time_counter = time_counter + TIME_INTERVAL;

        return this.score;
    }
}
