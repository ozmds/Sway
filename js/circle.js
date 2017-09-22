/* Cleaned up on Sept 21 */

class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.deg = 1.5 * Math.PI;
		this.dir = LEFT;
		this.sp = 0;
		this.spikeHeight = null;
		this.minR = r;

		this.tempi = null;
		this.tempj = null;
		this.tempx = null;
		this.tempy = null;
	}

	getX() {
		return this.x;
	}

	setX(x) {
		this.x = x;
	}

	getY() {
		return this.y;
	}

	setY(x) {
		this.y = x;
	}

	getR() {
		return this.r;
	}

	setR(x) {
		this.r = x;
	}

	getDir() {
		return this.dir;
	}

	setDir(x) {
		this.dir = x;
	}

	getDeg() {
		return this.deg;
	}

	setDeg(x) {
		this.deg = x;
	}

	getMinR() {
		return this.minR;
	}

	setSpikeHeight(x) {
		this.spikeHeight = x;
	}

	getSpikeHeight() {
		return this.spikeHeight;
	}

	flip() {
		if (this.dir == LEFT) {
			this.dir = RIGHT;
		} else {
			this.dir = LEFT;
		}
	}

	spin() {
		this.sp = this.sp + 0.008;
	}

	drawInnerCircle() {
		CONTEXT.lineWidth = LINE_WIDTH * 0.80;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(this.x, this.y, this.r * 0.65, 0.0 * Math.PI + (this.sp * 2.0 * Math.PI),
													2.0 * Math.PI * 0.85 + (this.sp * 2.0 * Math.PI));
		CONTEXT.stroke();
		CONTEXT.closePath();
	}

	drawSpikes() {
		CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH * 1.4;

		for (this.tempi = 0; this.tempi < 6; this.tempi++) {
			CONTEXT.beginPath();
			for (this.tempj = 0; this.tempj < 3; this.tempj++) {
				this.tempx = this.r * Math.cos((this.tempi + this.tempj / 2) * Math.PI / 3 + (this.sp * Math.PI));
				this.tempy = this.r * Math.sin((this.tempi + this.tempj / 2) * Math.PI / 3 + (this.sp * Math.PI));

				if (this.tempj == 1) {
					this.tempx = this.spikeHeight * this.tempx;
					this.tempy = this.spikeHeight * this.tempy;
				}

				this.tempx = this.tempx + this.x;
				this.tempy = this.tempy + this.y;

				if (this.tempj == 0) {
					CONTEXT.moveTo(this.tempx, this.tempy);
				} else {
					CONTEXT.lineTo(this.tempx, this.tempy);
				}
			}

			CONTEXT.stroke();
			CONTEXT.fill();
			CONTEXT.closePath();
		}
	}

	draw() {
		CONTEXT.fillStyle = PRIMARY_COLOUR;
		CONTEXT.lineWidth = LINE_WIDTH;
		CONTEXT.strokeStyle = SECONDARY_COLOUR;

		CONTEXT.beginPath();
		CONTEXT.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		CONTEXT.fill();
		CONTEXT.stroke();
		CONTEXT.closePath();
	}

	hitWall() {
		if (this.x < this.r + PADDING) {
			return true;
		} else if (this.x > (CANVAS.width - (this.r + PADDING))) {
			return true;
		}
	}

	move(speed, armLength, cen) {
		if (this.dir == LEFT) {
			this.deg -= speed;
		} else {
			this.deg += speed;
		}

		this.x = cen.getX() + Math.cos(this.deg) * armLength;
		this.y = cen.getY() - Math.sin(this.deg) * armLength;

		if (this.hitWall()) {
			this.flip();
			if (this.dir == LEFT) {
				this.deg -= 2 * speed;
			} else {
				this.deg += 2 * speed;
			}

			this.x = cen.getX() + Math.cos(this.deg) * armLength;
			this.y = cen.getY() - Math.sin(this.deg) * armLength;
		}
	}
}
