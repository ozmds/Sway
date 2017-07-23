class Circle {
	constructor(x, y, r, col, owid, ocol, ctx, cnv) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.col = col;
		this.owid = owid;
		this.ocol = ocol;
		this.ctx = ctx;
		this.cnv = cnv;
		this.deg = 1.5 * Math.PI;
		this.dir = LEFT;
		this.sp = 0;
		this.oldR = r;
	}

	setDir(x) {
		this.dir = x;
	}

	getDir() {
		return this.dir;
	}

	setCol(x) {
		this.col = x;
	}

	getOldR() {
		return this.oldR;
	}

	setX(x) {
		this.x = x;
	}

	setR(x) {
		this.r = x;
	}

	setY(x) {
		this.y = x;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getR() {
		return this.r;
	}

	getDeg() {
		return this.deg;
	}

	setDeg(x) {
		this.deg = x;
	}

	flip() {
		if (this.dir == LEFT) {
			this.dir = RIGHT;
		} else {
			this.dir = LEFT;
		}
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

	spin() {
		this.sp = this.sp + 0.008;
	}

	drawSpikes(a) {
		var i;
		var j;

		var x;
		var y;

		this.ctx.strokeStyle = this.ocol;
		this.ctx.lineWidth = this.owid * 0.8;
		this.ctx.fillStyle = this.col;

		for (i = 0; i < 6; i++) {
			this.ctx.beginPath();
			for (j = 0; j < 3; j++) {
				x = this.r * Math.cos((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));
				y = this.r * Math.sin((i + j / 2) * Math.PI / 3 + (this.sp * Math.PI));

				if (j == 1) {
					x = a * x;
					y = a * y;
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
		this.ctx.arc(this.x, this.y, this.r, 0.0 * Math.PI, 2.0 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
		this.ctx.closePath();
	}

	hitWall(pad) {
		if (this.x < this.r + pad) {
			return true;
		} else if (this.x > (this.cnv.width - (this.r + pad))) {
			return true;
		}
	}

	move(speed, armLength, cen, pad) {
		if (this.dir == LEFT) {
			this.deg -= speed;
		} else {
			this.deg += speed;
		}

		this.x = cen.getX() + Math.cos(this.deg) * armLength;
		this.y = cen.getY() - Math.sin(this.deg) * armLength;

		if (this.hitWall(pad)) {
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
