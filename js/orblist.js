class OrbList {
    constructor(cnv, ctx) {
        this.cnv = cnv;
        this.ctx = ctx;
        this.orbList = [];
        this.hitList = [];
        this.speed = 0;
    }

    getCtx() {
		/* Return Context */
		return this.ctx;
	}

	getCnv() {
		/* Return Canvas */
		return this.cnv;
	}

    calculateSpeed() {
		/* Calculate Speed of Orb based on orb_time */
		this.speed = Math.round(this.cnv.height / (orb_time / TIME_INTERVAL));
	}

    createOrb() {
		/* Create a New Orb */
		var d = new Diamond(this.cnv.width * 0.035, this.ctx, this.cnv, this.score, this.speed);
		d.place(this.pen.getArm().getOldLen(), this.pen.getPen().getR());
		this.orbList.push(d);
	}

	checkHit(orb, pen1, pen2) {
		/* Check if Orb has been hit by Pendulum */
		if (orb.checkHitPen(pen1.getX(), pen1.getY(), pen1.getR() * this.pen.getSpikeHeight())) {
			return true;
		} else if (orb.checkHitPen(pen2.getX(), pen2.getY(), pen2.getR())) {
			return true;
		}

		return false;
	}

	setStatusByOrb(orb_type) {
		/* Set Game Status by Orb Return Type */
		if (orb_type != REGULAR) {
			this.setStatus(orb_type);
		}
	}

    incrementOrbTime(score) {
        /* Increase the speed of all orbs */
        if ((score % 10 == 0) && (score <= 200)) {
            orb_time = ORB_START_TIME - (score / 10) * ORB_DECREMENT_TIME;
            this.calculateSpeed();
        }
    }

    incrementOrbFrequency(score) {
        /* Increase Frequency of all orbs */
        if ((score % 15 == 0) && (score <= 300)) {
            orb_frequency = ORB_FREQ_START_TIME - (score / 15) * ORB_FREQ_DECREMENT_TIME;
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
                this.hitList[i].draw();
            }
        }
    }

    manageOrbs() {
        /* Manage the all of the orbs currently on the screen */
        var i;

        /* Create a New Orb */
        if (time_counter >= orb_frequency) {
            time_counter = 0;
            this.createOrb();
        }

        /* For Each Orb */
        for (i = 0; i < this.orbList.length; i++) {

            /* Change All Orbs to Regular during Power-Up */
            if (this.status != REGULAR) {
                this.orbList[i].setType(REGULAR);
                this.orbList[i].setImage();
            }

            /* Move Orb */
            this.orbList[i].move(1);

            /* Check if Orb Hits Floor */
            if (this.orbList[i].getY() > (this.cnv.height + this.orbList[i].getR() * 2)) {
                if (this.orbList[i].getType() == REGULAR) {
                    this.orbList.splice(i, 1);
                    this.score = 0;
                }
            /* Check if Orb Hits Pendulum */
            } else if (this.checkHit(this.orbList[i], this.pen.getPen(), this.pen.getSPen())) {
                this.hitList.push(this.orbList[i]);

                this.setStatusByOrb(this.orbList[i].getType());

                if (this.orbList[i].getType() == REGULAR) {
                    this.incrementScore();
                    this.incrementPenSpeed(this.score);
                    this.incrementOrbTime(this.score);
                    this.incrementOrbFrequency(this.score);
                }

                this.orbList.splice(i, 1);

            } else {
                this.orbList[i].draw();
            }
        }

        /* Manage Orbs Already Hit */
        this.manageHitList(i);

        time_counter = time_counter + TIME_INTERVAL;
    }
}
