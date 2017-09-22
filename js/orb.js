/* Cleaned up on Sept 21 */

class Orb {
	constructor(r, speed) {
		this.x = null;
		this.y = -2 * r;
		this.r = r;
		this.type = null;
		this.aspectRatio = 0;
		this.img = null;
		this.speed = speed;
		this.ring = r;
		this.transparency = 1;
		this.randInt = null;

		this.distx = null;
		this.disty = null;

		this.initType();
		this.initSpeed();
		this.setImage();
	}

	getType() {
		return this.type;
	}

	setType(x) {
		this.type = x;
	}

	getR() {
		return this.r;
	}

	setR(x) {
		this.r = x;
	}

	getY() {
		return this.y;
	}

	getRing() {
		return this.ring;
	}

	getTransparency() {
		return this.transparency;
	}

	incrementTransparency() {
		this.transparency = this.transparency - 0.05;
	}

	move(x) {
		this.y += this.speed * x;
	}

	incrementRing() {
		this.ring = this.ring + CANVAS.width * 0.02;
	}

	initSpeed() {
		this.randInt = Math.random() * 100;

		if (this.randInt < TWO_SPEED_RATIO) {
			this.speed = this.speed * 2;
		} else if (this.randInt < TWO_SPEED_RATIO + THREE_SPEED_RATIO) {
			this.speed = this.speed * 3;
		}
	}

	initType() {
		this.randInt = Math.random() * 100;

		if (this.randInt < 20) {
			this.type = REGULAR;
		} else if (this.randInt < 40) {
			this.type = BOMB;
		} else if (this.randInt < 60) {
			this.type = SHORT;
		} else if (this.randInt < 80) {
			this.type = DOUBLE;
		} else {
			this.type = SPIKE
		}
	}

	setImage() {
		if (this.type == REGULAR) {
			this.img = crystal;
		} else if (this.type == DOUBLE) {
			this.img = balloon;
		} else if (this.type == SHORT) {
			this.img = arrow;
		} else if (this.type == BOMB) {
			this.img = bomb;
		} else if (this.type == SPIKE) {
			this.img = knife;
		}

		this.aspectRatio = this.img.height / this.img.width;
	}

	checkHitPen(pen) {
		this.distx = Math.pow(this.x - pen.getX(), 2);
		this.disty = Math.pow(this.y - pen.getY(), 2);

		if (Math.pow(Math.max(pen.getR(), pen.getR() * pen.getSpikeHeight()) + this.r, 2) > (this.distx + this.disty)) {
			return true;
		}

		return false;
	}

	furthestCorner() {
		return Math.max(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)),
			Math.sqrt(Math.pow(CANVAS.height - this.y, 2) + Math.pow(this.x, 2)),
			Math.sqrt(Math.pow(CANVAS.height - this.y, 2) + Math.pow(CANVAS.width - this.x, 2)),
			Math.sqrt(Math.pow(CANVAS.width - this.x, 2) + Math.pow(this.y, 2)));
	}

	drawRing() {
		CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH * 0.60;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(this.x, this.y, this.ring, 0.0 * Math.PI, 2.0 * Math.PI);
		CONTEXT.fill();
		CONTEXT.stroke();
		CONTEXT.closePath();
	}

	draw() {
	    CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH * 0.60;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		CONTEXT.fill();
		CONTEXT.stroke();
		CONTEXT.closePath();

		CONTEXT.drawImage(this.img, this.x - this.r * 0.5, this.y - this.r * this.aspectRatio * 0.5,
			this.r, this.r * this.aspectRatio);
	}

	place(range) {
		if (CANVAS.width < range) {
			this.x = Math.round(Math.random() * (CANVAS.width - 4 * this.r)) + 2 * this.r;
		} else {
			this.x = Math.round(Math.random() *	 range) + (0.5 * (CANVAS.width - range));
		}
	}
}
