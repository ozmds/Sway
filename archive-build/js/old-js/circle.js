class Circle {
	constructor(x, y, r, ctx, cnv) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.col = PRIMARY_COLOUR;
		this.owid = LINE_WIDTH;
		this.ocol = SECONDARY_COLOUR;
		this.ctx = ctx;
		this.cnv = cnv;
		this.deg = 1.5 * Math.PI;
		this.dir = LEFT;
		this.sp = 0;
		this.spikeHeight = null;
		this.minR = r;
		this.tempI = null;
		this.tempJ = null;
		this.tempX = null;
		this.tempY = null;
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

	setCol(x) {
		this.col = x;
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
		this.ctx.lineWidth = LINE_WIDTH * 0.8;
		this.ctx.strokeStyle = SECONDARY_COLOUR;

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 0.65, 0.0 * Math.PI + (this.sp * 2.0 * Math.PI),
													2.0 * Math.PI * 0.85 + (this.sp * 2.0 * Math.PI));
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawSpikes() {
		var gradient;

		gradient = this.ctx.createLinearGradient(0, 0, this.cnv.width, this.cnv.height);
		gradient.addColorStop(1, '#000000');
		gradient.addColorStop(0, PRIMARY_COLOUR);

		this.ctx.fillStyle = gradient;

		this.ctx.strokeStyle = SECONDARY_COLOUR;
		this.ctx.lineWidth = LINE_WIDTH * 1.4;

		for (this.tempI = 0; this.tempI < 6; this.tempI++) {
			this.ctx.beginPath();
			for (this.tempJ = 0; this.tempJ < 3; this.tempJ++) {
				this.tempX = this.r * Math.cos((this.tempI + this.tempJ / 2) * Math.PI / 3 + (this.sp * Math.PI));
				this.tempY = this.r * Math.sin((this.tempI + this.tempJ / 2) * Math.PI / 3 + (this.sp * Math.PI));

				if (this.tempJ == 1) {
					this.tempX = this.spikeHeight * x;
					this.tempY = this.spikeHeight * y;
				}

				this.tempX = this.tempX + this.x;
				this.tempY = this.tempY + this.y;

				if (this.tempJ == 0) {
					this.ctx.moveTo(this.tempX, this.tempY);
				} else {
					this.ctx.lineTo(this.tempX, this.tempY);
				}
			}

			this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		}
	}

	draw() {
		var gradient;

		gradient = this.ctx.createLinearGradient(0, 0, this.cnv.width, this.cnv.height);
		gradient.addColorStop(1, '#000000');
		gradient.addColorStop(0, PRIMARY_COLOUR);

		this.ctx.fillStyle = gradient;

		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = '#FFFFFF';

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}

	hitWall() {
		if (this.x < this.r + PADDING) {
			return true;
		} else if (this.x > (this.cnv.width - (this.r + PADDING))) {
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
