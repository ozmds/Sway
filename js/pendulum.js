class Pendulum {
	constructor(cen, pen, arm) {
		this.cen = cen;
		this.pen = pen;
		this.arm = arm;

		this.startRange = null;
		this.endRange = null;

		this.spikeHeight = 0.8;
		this.minLen = 0;
		this.sArm = null;
		this.sPen = null;
		this.timer = 0;

		this.speed = null;
	}

	getPen() {
		return this.pen;
	}

	getCen() {
		return this.cen;
	}

	getArm() {
		return this.arm;
	}

	getSPen() {
		return this.sPen;
	}

	setSPen(x) {
		this.sPen = x;
	}

	setSArm(x) {
		this.sArm = x;
	}

	getSpikeHeight() {
		return this.spikeHeight;
	}

	setSpikeHeight(x) {
		this.spikeHeight = x;
	}

	setCol(x) {
		this.pen.setCol(x);
		this.cen.setCol(x);
		this.sPen.setCol(x);
	}

	setRange(width) {
		var span = Math.asin((width - (this.pen.getR() + PADDING)) / this.arm.getMaxLen());
		this.startRange = Math.PI * 1.5 - span;
		this.endRange = Math.PI * 1.5 + span;
	}

	calcPenSpeed(penTime) {
		this.speed = (this.endRange - this.startRange) / (penTime / TIME_INTERVAL);
	}

	setMinLen(cnv) {
		this.minLen = (cnv.width / 2) - this.pen.getR() - PADDING;
	}

	draw() {
		this.pen.spin();
		this.arm.draw();
		this.sArm.draw();
		this.cen.draw();
		this.sPen.draw();
		this.pen.setSpikeHeight(this.spikeHeight);
		this.pen.drawSpikes();
		this.pen.draw();
		this.pen.drawInnerCircle();
	}

	move(status) {
		this.pen.move(this.speed, this.arm.getLen(), this.cen);

		if (status == DOUBLE) {
			this.sPen.move(-this.speed, this.sArm.getLen(), this.cen);
		} else {
			this.sPen.move(this.speed, this.sArm.getLen(), this.cen);
		}

		this.arm.setEndX(this.pen.getX());
		this.arm.setEndY(this.pen.getY());
		this.sArm.setEndX(this.sPen.getX());
		this.sArm.setEndY(this.sPen.getY());
	}

	startShrink() {
		var deg = null;
		if (this.pen.getDeg() > 0) {
			deg = this.pen.getDeg() % (2 * Math.PI);
		} else {
			deg = (2 * Math.PI) - Math.abs(this.pen.getDeg() % (2 * Math.PI));
		}

		if (this.timer < 15000) {
			DEST_COLOUR = RED;
			if (this.arm.getLen() > this.minLen) {
				this.arm.setLen(this.arm.getLen() * 0.99);
				this.sArm.setLen(this.sArm.getLen() * 0.99);
			}
		} else {
			DEST_COLOUR = BLUE;
			if (this.arm.getMaxLen() > this.arm.getLen()) {
				if ((deg > this.startRange) && (deg < this.endRange)) {
					this.arm.setLen(this.arm.getLen() * 1.01);
					this.sArm.setLen(this.sArm.getLen() * 1.01);
				}
			} else {
				this.arm.setLen(this.arm.getMaxLen());
				this.sArm.setLen(this.sArm.getMaxLen());
				this.timer = 0;
				return false;
			}
		}

		this.timer += TIME_INTERVAL;
		return true;
	}

	startBalloon() {
		var dist_x = Math.pow(Math.abs(this.pen.getX() - this.sPen.getX()), 2);
		var dist_y = Math.pow(Math.abs(this.pen.getY() - this.sPen.getY()), 2);

		if (this.timer > 15000) {
			DEST_COLOUR = BLUE;
			if (dist_x + dist_y < Math.pow(this.pen.getR(), 2)) {
				this.sPen.setDeg(this.pen.getDeg());
				this.sPen.setDir(this.pen.getDir());
				this.timer = 0;
				return false;
			}
		} else {
			DEST_COLOUR = GREEN;
		}

		this.timer += TIME_INTERVAL;
		return true;
	}

	startSpike() {
		if (this.timer < 15000) {
			DEST_COLOUR = PURPLE;
			if (this.pen.getR() < 1.5 * this.pen.getMinR()) {
				this.arm.setLen(this.arm.getLen() - (this.pen.getR() * 0.01));
				this.sArm.setLen(this.sArm.getLen() - (this.sPen.getR() * 0.01));
				this.pen.setR(this.pen.getR() * 1.01);
				this.sPen.setR(this.sPen.getR() * 1.01);
			}

			if (this.spikeHeight < 2) {
				this.spikeHeight = this.spikeHeight * 1.01;
			}

		} else {
			DEST_COLOUR = BLUE;
			if (this.pen.getR() > this.pen.getMinR()) {
				this.arm.setLen(this.arm.getLen() + (this.pen.getR() * 0.01));
				this.sArm.setLen(this.sArm.getLen() + (this.sPen.getR() * 0.01));
				this.pen.setR(this.pen.getR() * 0.99);
				this.sPen.setR(this.sPen.getR() * 0.99);
			} else if (this.spikeHeight > 0.8) {
				this.spikeHeight = this.spikeHeight * 0.99;
			} else {
				this.arm.setLen(this.arm.getMaxLen());
				this.sArm.setLen(this.sArm.getMaxLen());
				this.pen.setR(this.pen.getMinR());
				this.sPen.setR(this.sPen.getMinR());
				this.timer = 0;
				return false;
			}
		}

		this.timer += TIME_INTERVAL;
		return true;
	}
}
