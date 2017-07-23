function Sway(cnv) {
	this.cnv = document.getElementById(cnv);
	this.ctx = this.cnv.getContext('2d');
	this.old_height = 0;
	this.pen = null;
	this.orbList = [];
	this.hitList = [];
	this.score = 0;
	this.speed = 0;
	this.status = REGULAR;

	this.cnv.style.top = (MARGIN).toString() + 'px';
	this.cnv.style.left = (MARGIN).toString() + 'px';

	this.getStatus = function() {
		/* Return Status */
		return this.status;
	}

	this.setStatus = function(x) {
		/* Set Status to x */
		this.status = x;
	}

	this.getScore = function() {
		/* Return Score */
		return this.score;
	}

	this.setScore = function(x) {
		/* Set Score to x */
		this.score = x;
	}

	this.incrementScore = function() {
		/* Increase Score By 1 */
		this.score += 1;

		if (this.score > window.localStorage.getItem('highscore')) {
			window.localStorage.setItem('highscore', this.score);
		}
	}

	this.getOldHeight = function() {
		/* Return Old Height */
		return this.old_height;
	};

	this.setOldHeight = function(x) {
		/* Set Old Height to x */
		this.old_height = x;
	}

	this.getCtx = function() {
		/* Return Context */
		return this.ctx;
	}

	this.getCnv = function() {
		/* Return Canvas */
		return this.cnv;
	}

	this.getPen = function() {
		/* Return Pendulum */
		return this.pen;
	}

	this.calculateSpeed = function() {
		/* Calculate Speed of Orb based on orb_time */
		this.speed = Math.round(this.cnv.height / (orb_time / TIME_INTERVAL));
	}

	this.initVariable = function() {
		/* Initialize all the main variables */

		/* Create The Pendulum */
		var cen_height = 0.60;
		var pen_rad = this.cnv.width * 0.1;

		var cen_x = this.cnv.width / 2;
		var cen_y = this.cnv.height * cen_height;

		var pen_x = this.cnv.width / 2;
		var pen_y = this.cnv.height - (pen_rad + PADDING);

		var arm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv);
		var cen = new Circle(cen_x, cen_y, pen_rad / 2, PRIMARY_COLOUR, this.cnv.width * 0.0175, SECONDARY_COLOUR, this.ctx, this.cnv);
		var pen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);

		var sArm = new Line(cen_x, cen_y, pen_x, pen_y, this.cnv.width * 0.015, SECONDARY_COLOUR, this.ctx, this.cnv);
		var sPen = new Circle(pen_x, pen_y, pen_rad, PRIMARY_COLOUR, this.cnv.width * 0.02, SECONDARY_COLOUR, this.ctx, this.cnv);

		this.pen = new Pendulum(cen, pen, arm);

		this.pen.setSArm(sArm);
		this.pen.setSPen(sPen);

		/* Create Boundaries for Pendulum */
		this.pen.setSmallLen(this.cnv);
		this.pen.setRange(this.cnv.width / 2, PADDING);

		/* Calculate Speed for Pendulum and Orb */
		this.calculateSpeed();
		this.pen.calcPenSpeed(pen_time);

		if (window.localStorage.getItem('highscore') == null) {
			window.localStorage.setItem('highscore', this.score);
		}
	};

	this.move = function() {
		/* Move the Pendulum as a Whole */
		this.pen.move(this.status);
		this.pen.draw();
	}

	this.createOrb = function() {
		/* Create a New Orb */
		var d = new Diamond(this.cnv.width * 0.035, this.ctx, this.cnv, this.score, this.speed);
		d.place(this.pen.getArm().getOldLen(), this.pen.getPen().getR());
		this.orbList.push(d);
	}

	this.checkHit = function(orb, pen1, pen2) {
		/* Check if Orb has been hit by Pendulum */
		if (orb.checkHitPen(pen1.getX(), pen1.getY(), pen1.getR() * this.pen.getSpikeHeight())) {
			return true;
		} else if (orb.checkHitPen(pen2.getX(), pen2.getY(), pen2.getR())) {
			return true;
		}

		return false;
	}

	this.setStatusByOrb = function(orb_type) {
		/* Set Game Status by Orb Return Type */
		if (orb_type != REGULAR) {
			this.setStatus(orb_type);
		}
	}

	this.incrementPenSpeed = function(score) {
		/* Increase Speed of Pendulum */
		if ((score % 10 == 0) && (score <= 100)) {
			pen_time = PEN_START_TIME - (score / 10) * PEN_DECREMENT_TIME;
			this.pen.calcPenSpeed(pen_time);
		}
	}

	this.incrementOrbTime = function(score) {
		/* Increase the speed of all orbs */
		if ((score % 10 == 0) && (score <= 200)) {
			orb_time = ORB_START_TIME - (score / 10) * ORB_DECREMENT_TIME;
			this.calculateSpeed();
		}
	}

	this.incrementOrbFrequency = function(score) {
		/* Increase Frequency of all orbs */
		if ((score % 15 == 0) && (score <= 300)) {
			orb_frequency = ORB_FREQ_START_TIME - (score / 15) * ORB_FREQ_DECREMENT_TIME;
		}
	}

	this.manageHitList = function(i) {
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

	this.manageOrbs = function() {
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

Sway.prototype.background = function() {
	/*Configure Basics of Screen Canvas */

	this.cnv.height = (window.innerHeight - 10) * window.devicePixelRatio;
	this.cnv.width = (window.innerWidth - 10) * window.devicePixelRatio;

	this.cnv.style.width = (this.cnv.width / window.devicePixelRatio).toString() + 'px';
	this.cnv.style.height = (this.cnv.height / window.devicePixelRatio).toString() + 'px';

	document.body.style.backgroundColor = PRIMARY_COLOUR;
	this.cnv.style.backgroundColor = PRIMARY_COLOUR;
};
