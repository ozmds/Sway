/* Cleaned up on Sept 22 */

class OrbList {
    constructor() {
        this.orbList = [];
        this.hitList = [];
        this.speed = 0;
        this.score = 0;
        this.status = null;
        this.oldStatus = null;

        this.i = null;
        this.hit_orb = null;
    }

    getOldStatus() {
        return this.oldStatus;
    }

    getStatus() {
        return this.status;
    }

    getScore() {
        return this.score;
    }

    calculateSpeed() {
        this.speed = CANVAS.height / (ORB_TIME / TIME_INTERVAL);
    }

    createOrb(pen) {
        this.orbList.push(new Orb(CANVAS.width * 0.07, this.speed));
        this.orbList[this.orbList.length - 1].place(pen.getRange());
    }

    clearOrbs() {
        this.orbList = [];
        this.hitList = [];
    }

    incrementOrbTime(score) {
        if ((score % 10 == 0) && (score <= 200)) {
            ORB_TIME = ORB_START_TIME - (score / 10) * ORB_DECREMENT_TIME;
            this.calculateSpeed();
        }
    }

    incrementOrbFrequency(score) {
        if ((score % 15 == 0) && (score <= 300)) {
            ORB_FREQUENCY = ORB_FREQ_START_TIME - (score / 15) * ORB_FREQ_DECREMENT_TIME;
        }
    }

    incrementPenSpeed(score, pen) {
        if ((score % 10 == 0) && (score <= 100)) {
            PEN_TIME = PEN_START_TIME - (score / 10) * PEN_DECREMENT_TIME;
            pen.calcPenSpeed();
        }
    }

    checkHit(orb, pen1, pen2) {
        if (orb.checkHitPen(pen1)) {
            return true;
        } else if (orb.checkHitPen(pen2)) {
            return true;
        }

        return false;
    }

    drawOrbs() {
        for (this.i = 0; this.i < this.orbList.length; this.i++) {
            this.orbList[this.i].draw();
        }

        for (this.i = 0; this.i < this.hitList.length; this.i++) {
            CONTEXT.globalAlpha = this.hitList[this.i].getTransparency();
            this.hitList[this.i].draw();
        }

        CONTEXT.globalAlpha = 1;
    }

    manageHitList() {
        for (this.i = 0; this.i < this.hitList.length; this.i++) {

            this.hitList[this.i].incrementTransparency();

            if (this.hitList[this.i].getTransparency() <= 0) {
                this.hitList.splice(this.i, 1);
            } else {
                this.hitList[this.i].move(-2);
            }
        }
    }

    manageOrbs(score, pen, cur_stat) {
        this.score = 0;
        this.status = null;
        this.oldStatus = null;
        this.hit_orb = null;

        if (TIME_COUNTER >= ORB_FREQUENCY) {
            TIME_COUNTER = 0;
            this.createOrb(pen);
        }

        for (this.i = 0; this.i < this.orbList.length; this.i++) {
            if (cur_stat != REGULAR) {
                this.orbList[this.i].setType(REGULAR);
                this.orbList[this.i].setImage();
            }

            this.orbList[this.i].move(1);

            if (this.orbList[this.i].getY() > (CANVAS.height - this.orbList[this.i].getR())) {
                if (this.orbList[this.i].getType() == REGULAR) {
                    this.oldStatus = cur_stat;
                    this.status = BOMB;
                    this.hit_orb = this.orbList[this.i];
                    STATE = TRANSITION;
                }
            } else if (this.checkHit(this.orbList[this.i], pen.getPen(), pen.getSPen())) {
                this.hitList.push(this.orbList[this.i]);
                this.status = this.orbList[this.i].getType();

                if (this.status == REGULAR) {
                    this.score = this.score + 1;
                    this.incrementOrbTime(score + 1);
                    this.incrementOrbFrequency(score + 1);
                    this.incrementPenSpeed(score + 1, pen);
                    this.orbList.splice(this.i, 1);
                } else if (this.status == BOMB) {
                    this.hit_orb = this.orbList[this.i];
                    STATE = TRANSITION;
                } else {
                    this.hit_orb = this.orbList[this.i];
                    STATE = TRANSITION;
                }
            }
        }

        this.manageHitList();

        TIME_COUNTER = TIME_COUNTER + TIME_INTERVAL;

        return this.hit_orb;
    }
}
