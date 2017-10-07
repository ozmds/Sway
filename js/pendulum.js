/* Cleaned up on Sept 21 */

class Pendulum {
	constructor(cen, pen, arm) {
		this.cen = cen;
		this.pen = pen;
		this.arm = arm;

		this.startRange = null;
		this.endRange = null;

		this.spikeHeight = 0.8;
		this.minLen = 0;
		this.maxLen = this.arm.getLen();
		this.minR = this.pen.getR();
		this.sArm = null;
		this.sPen = null;
		this.timer = 0;

		this.speed = null;

		this.range = 2 * (this.arm.getLen() + this.pen.getR());
		this.span = null;

		this.deg = null;
		this.distx = null;
		this.disty = null;
	}

	getRange() {
		return this.range;
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

	setRange() {
		this.span = Math.asin((CANVAS.width * 0.5 - (this.pen.getR() + PADDING)) / this.maxLen);
		this.startRange = Math.PI * 1.5 - this.span;
		this.endRange = Math.PI * 1.5 + this.span;
	}

	calcPenSpeed() {
		this.speed = (this.endRange - this.startRange) / (PEN_TIME / TIME_INTERVAL);
	}

	setMinLen() {
		this.minLen = (CANVAS.width / 2) - this.pen.getR() - PADDING;
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

	endShrink() {
		if (this.pen.getDeg() > 0) {
			this.deg = this.pen.getDeg() % (2 * Math.PI);
		} else {
			this.deg = (2 * Math.PI) - Math.abs(this.pen.getDeg() % (2 * Math.PI));
		}

		DEST_COLOUR = BLUE;
		if (this.maxLen > this.arm.getLen()) {
			if ((this.deg > this.startRange) && (this.deg < this.endRange)) {
				this.arm.setLen(this.arm.getLen() * 1.01);
				this.sArm.setLen(this.sArm.getLen() * 1.01);
			}
		} else {
			this.arm.setLen(this.maxLen);
			this.sArm.setLen(this.maxLen);
			this.timer = 0;
			return false;
		}

		return true;
	}

	startShrink() {
		if (this.timer < 15000) {
			DEST_COLOUR = RED;
			if (this.arm.getLen() > this.minLen) {
				this.arm.setLen(this.arm.getLen() * 0.99);
				this.sArm.setLen(this.sArm.getLen() * 0.99);
			}
		} else {
			return this.endShrink();
		}

		this.timer += TIME_INTERVAL;
		return true;
	}

	endBalloon() {
		this.distx = Math.pow(Math.abs(this.pen.getX() - this.sPen.getX()), 2);
		this.disty = Math.pow(Math.abs(this.pen.getY() - this.sPen.getY()), 2);

		DEST_COLOUR = BLUE;
		if (this.distx + this.disty < Math.pow(this.pen.getR(), 2)) {
			this.sPen.setDeg(this.pen.getDeg());
			this.sPen.setDir(this.pen.getDir());
			this.timer = 0;
			return false;
		}

		return true;
	}

	startBalloon() {
		if (this.timer > 15000) {
			return this.endBalloon();
		} else {
			DEST_COLOUR = GREEN;
		}

		this.timer += TIME_INTERVAL;
		return true;
	}

	endSpike() {
		DEST_COLOUR = BLUE;
		if (this.pen.getR() > this.minR) {
			this.arm.setLen(this.arm.getLen() + (this.pen.getR() * 0.01));
			this.sArm.setLen(this.sArm.getLen() + (this.sPen.getR() * 0.01));
			this.pen.setR(this.pen.getR() * 0.99);
			this.sPen.setR(this.sPen.getR() * 0.99);
		} else if (this.spikeHeight > 0.8) {
			this.spikeHeight = this.spikeHeight * 0.99;
		} else {
			this.arm.setLen(this.maxLen);
			this.sArm.setLen(this.maxLen);
			this.pen.setR(this.minR);
			this.sPen.setR(this.minR);
			this.timer = 0;
			return false;
		}

		return true;
	}

	startSpike() {
		if (this.timer < 15000) {
			DEST_COLOUR = PURPLE;
			if (this.pen.getR() < 1.5 * this.minR) {
				this.arm.setLen(this.arm.getLen() - (this.pen.getR() * 0.01));
				this.sArm.setLen(this.sArm.getLen() - (this.sPen.getR() * 0.01));
				this.pen.setR(this.pen.getR() * 1.01);
				this.sPen.setR(this.sPen.getR() * 1.01);
			}

			if (this.spikeHeight < 2) {
				this.spikeHeight = this.spikeHeight * 1.01;
			}

		} else {
			return this.endSpike();
		}

		this.timer += TIME_INTERVAL;
		return true;
	}
}
