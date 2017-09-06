class OrbList {
    constructor() {
        this.orbList = [];
        this.hitList = [];
        this.speed = 0;
        this.score = 0;
        this.status = null;
    }

    getStatus() {
        return this.status;
    }

    getScore() {
        return this.score;
    }

    calculateSpeed(cnv) {
        this.speed = cnv.height / (orb_time / TIME_INTERVAL);
    }

    createOrb(score, pen, cnv, ctx) {
        var d = new Orb(cnv.width * 0.035, ctx, cnv, score, this.speed);
        d.place(pen.getArm().getMaxLen(), pen.getPen().getR());
        this.orbList.push(d);
    }

    clearOrbs() {
        this.orbList = [];
        this.hitList = [];
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
        if (orb.checkHitPen(pen1.getX(), pen1.getY(), pen1.getR() * pen1.getSpikeHeight())) {
            return true;
        } else if (orb.checkHitPen(pen2.getX(), pen2.getY(), pen2.getR())) {
            return true;
        }

        return false;
    }

    drawOrbs(ctx) {
        var i;

        for (i = 0; i < this.orbList.length; i++) {
            this.orbList[i].draw();
        }

        for (i = 0; i < this.hitList.length; i++) {
            ctx.globalAlpha = this.hitList[i].getTransparency();
            this.hitList[i].draw();
            ctx.globalAlpha = 1;
        }
    }

    drawShadowOrbs(ctx) {
        var i;

        for (i = 0; i < this.orbList.length; i++) {
            this.orbList[i].drawShadow();
        }

        for (i = 0; i < this.hitList.length; i++) {
            ctx.globalAlpha = this.hitList[i].getTransparency();
            this.hitList[i].drawShadow();
            ctx.globalAlpha = 1;
        }
    }

    manageHitList(i, cnv) {
        /* Move All Orbs That Have Been Hit */
        for (i = 0; i < this.hitList.length; i++) {

            this.hitList[i].incrementTransparency();

            if (this.hitList[i].getTransparency() <= 0) {
                this.hitList.splice(i, 1);
            } else {
                this.hitList[i].move(-2);
            }
        }
    }

    manageOrbs(score, pen, cnv, ctx, cur_stat) {
        var i;
        var hit_orb = null;

        this.score = 0;

        if (time_counter >= orb_frequency) {
            time_counter = 0;
            this.createOrb(score, pen, cnv, ctx);
        }

        for (i = 0; i < this.orbList.length; i++) {
            if (cur_stat != REGULAR) {
                this.orbList[i].setType(REGULAR);
                this.orbList[i].setImage();
            }

            this.orbList[i].move(1);

            if (this.orbList[i].getY() > (cnv.height - this.orbList[i].getR() * 2)) {
                if (this.orbList[i].getType() == REGULAR) {
                    this.score = -score;
                    hit_orb = this.orbList[i];
                    STATE = TRANSITION;
                }
            } else if (this.checkHit(this.orbList[i], pen.getPen(), pen.getSPen())) {
                this.hitList.push(this.orbList[i]);
                this.status = this.orbList[i].getType();

                if (this.status == REGULAR) {
                    this.score = this.score + 1;
                    this.incrementOrbTime(score + 1, cnv);
                    this.incrementOrbFrequency(score + 1);
                    this.orbList.splice(i, 1);
                } else if (this.status == BOMB) {
                    this.score = -score;
                    hit_orb = this.orbList[i];
                    STATE = TRANSITION;
                } else {
                    hit_orb = this.orbList[i];
                    STATE = TRANSITION;
                }

                /*
                this.orbList.splice(i, 1);
                */
            }
        }

        this.manageHitList(i, cnv);

        time_counter = time_counter + TIME_INTERVAL;

        /*
        if (status && status != REGULAR) {
            this.clearOrbs();
        }
        */

        return hit_orb;
    }
}
