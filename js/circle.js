class Circle {
	constructor(x, y, r, widthRatio, ctx, cnv) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.col = PRIMARY_COLOUR;
		this.owid = widthRatio * this.r;
		this.ocol = SECONDARY_COLOUR;
		this.ctx = ctx;
		this.cnv = cnv;
		this.deg = 1.5 * Math.PI;
		this.dir = LEFT;
		this.sp = 0;
		this.spikeHeight = null;
		this.minR = r;
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
		this.ctx.lineWidth = this.owid * 0.80;
		this.ctx.strokeStyle = this.ocol;

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r * 0.65, 0.0 * Math.PI + (this.sp * 2.0 * Math.PI),
													2.0 * Math.PI * 0.85 + (this.sp * 2.0 * Math.PI));
		this.ctx.stroke();
		this.ctx.closePath();
	}

	drawSpikes() {
		var i, j, x, y;

		this.ctx.strokeStyle = this.ocol;
		this.ctx.lineWidth = this.owid * 0.8;
		this.ctx.fillStyle = this.col;

		for (i = 0; i < 6; i++) {
			this.ctx.beginPath();
			for (j = 0; j < 3; j++) {
				x = this.r * Math.cos((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));
				y = this.r * Math.sin((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));

				if (j == 1) {
					x = this.spikeHeight * x;
					y = this.spikeHeight * y;
				}

				x = x + this.x;
				y = y + this.y;

				if (j == 0) {
					this.ctx.moveTo(x, y);
				} else {
					this.ctx.lineTo(x, y);
				}
			}

			this.ctx.stroke();
			this.ctx.fill();
			this.ctx.closePath();
		}
	}

	draw() {
		this.ctx.fillStyle = this.col;
		this.ctx.lineWidth = this.owid;
		this.ctx.strokeStyle = this.ocol;

		this.ctx.beginPath();
		this.ctx.arc(this.x + this.r * 0.15, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();

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
