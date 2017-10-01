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
		IMAGESET.drawInnerCircle(this.x, this.y, this.r, this.sp);
	}

	drawSpikes() {
		IMAGESET.drawSpikes(this.x, this.y, this.r, this.sp, this.spikeHeight);
	}

	draw() {
		IMAGESET.drawCircle(this.x, this.y, this.r);
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
